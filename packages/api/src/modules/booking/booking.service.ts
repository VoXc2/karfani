import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { PricingService } from '../pricing/pricing.service';
import { generateBookingNumber } from '@karfani/shared';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['DISPATCHED'],
  DISPATCHED: ['HANDED_OVER'],
  HANDED_OVER: ['ACTIVE'],
  ACTIVE: ['RETURN_PENDING'],
  RETURN_PENDING: ['RETURNED'],
  RETURNED: ['POST_INSPECTION'],
  POST_INSPECTION: ['COMPLETED', 'DISPUTED'],
};

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private availability: AvailabilityService,
    private pricing: PricingService,
    private events: EventEmitter2,
  ) {}

  async create(customerId: string, data: any) {
    const { caravanId, startDate, endDate, addons = [], deliveryAddress, specialRequests, promoCode } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const isAvailable = await this.availability.checkAvailability(caravanId, start, end);
    if (!isAvailable) throw new BadRequestException('الكرفان غير متاح في هذه التواريخ');

    const priceResult = await this.pricing.calculatePrice(caravanId, start, end);
    const price = priceResult.data;

    let addonsPrice = 0;
    const bookingAddons = addons.map((a: any) => {
      const total = a.quantity * a.unitPrice;
      addonsPrice += total;
      return { nameAr: a.nameAr, nameEn: a.nameEn, quantity: a.quantity, unitPrice: a.unitPrice, totalPrice: total };
    });

    const caravan = await this.prisma.caravan.findUniqueOrThrow({ where: { id: caravanId } });
    const deliveryPrice = deliveryAddress && caravan.deliveryEnabled ? Number(caravan.deliveryFee || 0) : 0;

    const subtotal = price.subtotal + addonsPrice + deliveryPrice;
    const vatAmount = Math.round(subtotal * 0.15 * 100) / 100;
    const totalPrice = Math.round((subtotal + vatAmount) * 100) / 100;

    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        customerId,
        caravanId,
        startDate: start,
        endDate: end,
        totalDays: price.days,
        basePrice: price.basePrice,
        addonsPrice,
        deliveryPrice,
        discountAmount: price.discountAmount,
        vatAmount,
        totalPrice,
        securityDeposit: price.securityDeposit,
        deliveryAddress,
        specialRequests,
        addons: { create: bookingAddons },
      },
      include: { addons: true, caravan: { include: { media: { take: 1 } } } },
    });

    await this.availability.markBooked(caravanId, start, end);
    this.events.emit('booking.created', booking);

    return { success: true, data: booking };
  }

  async findByUser(userId: string, query: any) {
    const { status, page = 1, limit = 20 } = query;
    const where: any = { customerId: userId };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: { caravan: { include: { media: { take: 1 } } }, pickupLocation: true },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { success: true, data: bookings, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
  }

  async findByOwner(userId: string, query: any) {
    const { status, page = 1, limit = 20 } = query;
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) throw new NotFoundException('يجب إنشاء ملف مالك أولاً');

    const where: any = { caravan: { ownerId: owner.id } };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          caravan: { include: { media: { take: 1 } } },
          customer: { select: { fullNameAr: true, fullNameEn: true, phone: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      success: true,
      data: bookings,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { caravan: { include: { media: true, pickupLocation: true } }, addons: true, payments: true, contract: true, inspections: true, customer: { select: { fullNameAr: true, phone: true } } },
    });
    if (!booking) throw new NotFoundException('الحجز غير موجود');
    return { success: true, data: booking };
  }

  async cancel(id: string, userId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');
    if (booking.customerId !== userId) throw new ForbiddenException('غير مصرح');
    if (!['PENDING_PAYMENT', 'CONFIRMED'].includes(booking.status)) throw new BadRequestException('لا يمكن إلغاء هذا الحجز');

    const updated = await this.prisma.booking.update({ where: { id }, data: { status: 'CANCELLED', cancellationReason: reason } });
    this.events.emit('booking.cancelled', updated);
    return { success: true, data: updated };
  }

  async updateStatus(id: string, newStatus: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('الحجز غير موجود');

    const allowed = VALID_TRANSITIONS[booking.status];
    if (!allowed?.includes(newStatus)) throw new BadRequestException(`لا يمكن الانتقال من ${booking.status} إلى ${newStatus}`);

    const updated = await this.prisma.booking.update({ where: { id }, data: { status: newStatus as any } });
    this.events.emit('booking.statusChanged', { booking: updated, previousStatus: booking.status });
    return { success: true, data: updated };
  }
}
