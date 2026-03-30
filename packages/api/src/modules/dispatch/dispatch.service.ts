import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DispatchService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async assign(dispatcherId: string, data: any) {
    const { bookingId } = data;

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');
    if (booking.status !== 'CONFIRMED' && booking.status !== 'PREPARING') {
      throw new BadRequestException('لا يمكن تعيين مرسل لهذا الحجز بحالته الحالية');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'PREPARING' },
      include: {
        caravan: { select: { id: true, titleAr: true, plateNumber: true } },
        customer: { select: { fullNameAr: true, phone: true } },
        pickupLocation: true,
        dropoffLocation: true,
      },
    });

    this.events.emit('dispatch.assigned', { booking: updated, dispatcherId });
    return { success: true, data: updated };
  }

  async getActive() {
    const bookings = await this.prisma.booking.findMany({
      where: { status: { in: ['PREPARING', 'DISPATCHED'] } },
      include: {
        caravan: { select: { id: true, titleAr: true, plateNumber: true } },
        customer: { select: { fullNameAr: true, phone: true } },
        pickupLocation: true,
        dropoffLocation: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { success: true, data: bookings };
  }

  async markPickedUp(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');
    if (booking.status !== 'PREPARING') {
      throw new BadRequestException('الحجز ليس في مرحلة التجهيز');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'DISPATCHED' },
      include: {
        caravan: { select: { id: true, titleAr: true, plateNumber: true } },
        customer: { select: { fullNameAr: true, phone: true } },
      },
    });

    this.events.emit('dispatch.pickedUp', updated);
    return { success: true, data: updated };
  }

  async markDelivered(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');
    if (booking.status !== 'DISPATCHED') {
      throw new BadRequestException('الحجز ليس في مرحلة التوصيل');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'HANDED_OVER' },
      include: {
        caravan: { select: { id: true, titleAr: true, plateNumber: true } },
        customer: { select: { fullNameAr: true, phone: true } },
      },
    });

    this.events.emit('dispatch.delivered', updated);
    return { success: true, data: updated };
  }

  async markReturned(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');
    if (booking.status !== 'RETURN_PENDING' && booking.status !== 'ACTIVE') {
      throw new BadRequestException('الحجز ليس في مرحلة الإرجاع');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'RETURNED' },
      include: {
        caravan: { select: { id: true, titleAr: true, plateNumber: true } },
        customer: { select: { fullNameAr: true, phone: true } },
      },
    });

    this.events.emit('dispatch.returned', updated);
    return { success: true, data: updated };
  }

  async getHistory(query: any) {
    const { page = 1, limit = 20 } = query;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { status: { in: ['HANDED_OVER', 'ACTIVE', 'RETURN_PENDING', 'RETURNED', 'POST_INSPECTION', 'COMPLETED'] } },
        include: {
          caravan: { select: { id: true, titleAr: true, plateNumber: true } },
          customer: { select: { fullNameAr: true, phone: true } },
          pickupLocation: true,
          dropoffLocation: true,
        },
        orderBy: { updatedAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.booking.count({
        where: { status: { in: ['HANDED_OVER', 'ACTIVE', 'RETURN_PENDING', 'RETURNED', 'POST_INSPECTION', 'COMPLETED'] } },
      }),
    ]);

    return {
      success: true,
      data: bookings,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    };
  }
}
