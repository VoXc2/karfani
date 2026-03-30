import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class InspectionService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async create(inspectorId: string, data: any) {
    const { bookingId, type, odometerKm, fuelLevel, checklist, notes, photos = [] } = data;

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');

    const inspection = await this.prisma.inspection.create({
      data: {
        bookingId,
        inspectorId,
        type,
        odometerKm,
        fuelLevel,
        checklist: checklist || [],
        notes,
        photos: {
          create: photos.map((p: any) => ({
            url: p.url,
            category: p.category,
            notes: p.notes,
          })),
        },
      },
      include: { photos: true, inspector: { select: { fullNameAr: true, phone: true } } },
    });

    this.events.emit('inspection.created', inspection);
    return { success: true, data: inspection };
  }

  async findOne(id: string) {
    const inspection = await this.prisma.inspection.findUnique({
      where: { id },
      include: {
        photos: true,
        inspector: { select: { fullNameAr: true, phone: true } },
        booking: { select: { id: true, bookingNumber: true, caravanId: true, status: true } },
        damageReports: true,
      },
    });
    if (!inspection) throw new NotFoundException('الفحص غير موجود');
    return { success: true, data: inspection };
  }

  async complete(id: string, data: any) {
    const inspection = await this.prisma.inspection.findUnique({ where: { id } });
    if (!inspection) throw new NotFoundException('الفحص غير موجود');
    if (inspection.completedAt) throw new BadRequestException('الفحص مكتمل بالفعل');

    const { cleanlinessScore, overallScore, notes } = data;

    const updated = await this.prisma.inspection.update({
      where: { id },
      data: {
        cleanlinessScore,
        overallScore,
        notes: notes || inspection.notes,
        completedAt: new Date(),
      },
      include: { photos: true, booking: true },
    });

    this.events.emit('inspection.completed', updated);
    return { success: true, data: updated };
  }

  async findByBooking(bookingId: string) {
    const inspections = await this.prisma.inspection.findMany({
      where: { bookingId },
      include: {
        photos: true,
        inspector: { select: { fullNameAr: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: inspections };
  }
}
