import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async create(data: any) {
    const { caravanId, type, priority, description, parts, vendorName, vendorContact, estimatedCost, scheduledDate } = data;

    const caravan = await this.prisma.caravan.findUnique({ where: { id: caravanId } });
    if (!caravan) throw new NotFoundException('الكرفان غير موجود');

    const job = await this.prisma.maintenanceJob.create({
      data: {
        caravanId,
        type,
        priority: priority || 'MEDIUM',
        description,
        parts,
        vendorName,
        vendorContact,
        estimatedCost,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      },
      include: { caravan: { select: { id: true, titleAr: true, plateNumber: true } } },
    });

    this.events.emit('maintenance.scheduled', job);
    return { success: true, data: job };
  }

  async findAll(query: any) {
    const { caravanId, status, priority, page = 1, limit = 20 } = query;
    const where: any = {};
    if (caravanId) where.caravanId = caravanId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [jobs, total] = await Promise.all([
      this.prisma.maintenanceJob.findMany({
        where,
        include: { caravan: { select: { id: true, titleAr: true, plateNumber: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.maintenanceJob.count({ where }),
    ]);

    return {
      success: true,
      data: jobs,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.maintenanceJob.findUnique({
      where: { id },
      include: { caravan: { select: { id: true, titleAr: true, plateNumber: true, status: true } } },
    });
    if (!job) throw new NotFoundException('مهمة الصيانة غير موجودة');
    return { success: true, data: job };
  }

  async start(id: string) {
    const job = await this.prisma.maintenanceJob.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('مهمة الصيانة غير موجودة');
    if (job.status !== 'SCHEDULED') throw new BadRequestException('لا يمكن بدء هذه المهمة');

    const [updated] = await this.prisma.$transaction([
      this.prisma.maintenanceJob.update({
        where: { id },
        data: { status: 'IN_PROGRESS', startedAt: new Date() },
        include: { caravan: true },
      }),
      this.prisma.caravan.update({
        where: { id: job.caravanId },
        data: { status: 'MAINTENANCE' },
      }),
    ]);

    this.events.emit('maintenance.started', updated);
    return { success: true, data: updated };
  }

  async complete(id: string, data: any) {
    const job = await this.prisma.maintenanceJob.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('مهمة الصيانة غير موجودة');
    if (job.status !== 'IN_PROGRESS') throw new BadRequestException('المهمة ليست قيد التنفيذ');

    const { actualCost, notes } = data;

    const [updated] = await this.prisma.$transaction([
      this.prisma.maintenanceJob.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          actualCost,
          completedAt: new Date(),
          description: notes ? `${job.description}\n\nملاحظات الإكمال: ${notes}` : job.description,
        },
        include: { caravan: true },
      }),
      this.prisma.caravan.update({
        where: { id: job.caravanId },
        data: { status: 'ACTIVE' },
      }),
    ]);

    this.events.emit('maintenance.completed', updated);
    return { success: true, data: updated };
  }

  async findByCaravan(caravanId: string) {
    const jobs = await this.prisma.maintenanceJob.findMany({
      where: { caravanId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: jobs };
  }
}
