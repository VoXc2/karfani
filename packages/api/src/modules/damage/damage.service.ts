import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  REPORTED: ['ASSESSING'],
  ASSESSING: ['ASSESSED'],
  ASSESSED: ['RESOLVED', 'DISPUTED', 'CUSTOMER_RESPONSE'],
  CUSTOMER_RESPONSE: ['ASSESSED', 'RESOLVED', 'DISPUTED'],
  DISPUTED: ['ASSESSING', 'RESOLVED'],
};

@Injectable()
export class DamageService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async create(reportedById: string, data: any) {
    const { bookingId, inspectionId, severity, description, photos = [] } = data;

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, caravanId: true },
    });
    if (!booking) throw new NotFoundException('الحجز غير موجود');

    const report = await this.prisma.damageReport.create({
      data: {
        bookingId,
        inspectionId,
        reportedById,
        severity,
        description,
        photos: {
          create: photos.map((p: any) => ({
            url: p.url,
            description: p.description,
          })),
        },
      },
      include: {
        photos: true,
        reportedBy: { select: { fullNameAr: true, phone: true } },
      },
    });

    this.events.emit('damage.reported', { report, caravanId: booking.caravanId });
    return { success: true, data: report };
  }

  async findOne(id: string) {
    const report = await this.prisma.damageReport.findUnique({
      where: { id },
      include: {
        photos: true,
        reportedBy: { select: { fullNameAr: true, phone: true } },
        booking: { select: { id: true, bookingNumber: true, caravanId: true } },
        inspection: { select: { id: true, type: true } },
      },
    });
    if (!report) throw new NotFoundException('تقرير الضرر غير موجود');
    return { success: true, data: report };
  }

  async assess(id: string, data: any) {
    const report = await this.prisma.damageReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('تقرير الضرر غير موجود');

    const allowed = VALID_TRANSITIONS[report.status];
    const targetStatus = data.status || 'ASSESSED';
    if (!allowed?.includes(targetStatus)) {
      throw new BadRequestException(`لا يمكن الانتقال من ${report.status} إلى ${targetStatus}`);
    }

    const { estimatedCost, actualCost, depositDeduction, customerResponse } = data;

    const updated = await this.prisma.damageReport.update({
      where: { id },
      data: {
        estimatedCost,
        actualCost,
        depositDeduction,
        customerResponse,
        status: targetStatus as any,
        resolvedAt: targetStatus === 'RESOLVED' ? new Date() : undefined,
      },
      include: { photos: true, booking: true },
    });

    this.events.emit('damage.assessed', updated);
    return { success: true, data: updated };
  }

  async findByBooking(bookingId: string) {
    const reports = await this.prisma.damageReport.findMany({
      where: { bookingId },
      include: {
        photos: true,
        reportedBy: { select: { fullNameAr: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: reports };
  }

  async findByCaravan(caravanId: string) {
    const reports = await this.prisma.damageReport.findMany({
      where: { booking: { caravanId } },
      include: {
        photos: true,
        reportedBy: { select: { fullNameAr: true, phone: true } },
        booking: { select: { id: true, bookingNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: reports };
  }
}
