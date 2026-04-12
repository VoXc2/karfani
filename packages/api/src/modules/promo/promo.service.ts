import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';

@Injectable()
export class PromoService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async create(data: CreatePromoDto) {
    const existing = await this.prisma.promoCode.findUnique({ where: { code: data.code } });
    if (existing) throw new BadRequestException('كود الخصم موجود بالفعل');

    const promoCode = await this.prisma.promoCode.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses,
        maxUsesPerUser: data.maxUsesPerUser,
        minBookingDays: data.minBookingDays,
        minBookingAmount: data.minBookingAmount,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? true,
      },
    });

    this.events.emit('promo.created', promoCode);
    return { success: true, data: promoCode };
  }

  async findAll(query: { page?: number; limit?: number; isActive?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const where: any = {};

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    const [promoCodes, total] = await Promise.all([
      this.prisma.promoCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.promoCode.count({ where }),
    ]);

    return {
      success: true,
      data: promoCodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async validate(code: string, bookingDays: number, bookingAmount: number, userId: string) {
    const promoCode = await this.prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    if (!promoCode) throw new NotFoundException('كود الخصم غير موجود');

    if (!promoCode.isActive) {
      throw new BadRequestException('كود الخصم غير مفعل');
    }

    const now = new Date();
    if (now < promoCode.startDate || now > promoCode.endDate) {
      throw new BadRequestException('كود الخصم منتهي الصلاحية');
    }

    if (promoCode.maxUses !== null && promoCode.currentUses >= promoCode.maxUses) {
      throw new BadRequestException('تم استنفاد الحد الأقصى لاستخدام كود الخصم');
    }

    // Check per-user usage limit
    const userUsageCount = await this.prisma.booking.count({
      where: { promoCodeId: promoCode.id, customerId: userId },
    });
    if (userUsageCount >= promoCode.maxUsesPerUser) {
      throw new BadRequestException('لقد استخدمت هذا الكود الحد الأقصى المسموح');
    }

    if (promoCode.minBookingDays !== null && bookingDays < promoCode.minBookingDays) {
      throw new BadRequestException(`الحد الأدنى لأيام الحجز هو ${promoCode.minBookingDays} أيام`);
    }

    if (promoCode.minBookingAmount !== null && bookingAmount < Number(promoCode.minBookingAmount)) {
      throw new BadRequestException(`الحد الأدنى لمبلغ الحجز هو ${promoCode.minBookingAmount} ريال`);
    }

    let discountAmount: number;
    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = Math.round(bookingAmount * Number(promoCode.discountValue) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(Number(promoCode.discountValue), bookingAmount);
    }

    return {
      success: true,
      data: {
        promoCodeId: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: Number(promoCode.discountValue),
        discountAmount,
      },
    };
  }

  async apply(promoCodeId: string, bookingId: string) {
    const promoCode = await this.prisma.promoCode.findUnique({ where: { id: promoCodeId } });
    if (!promoCode) throw new NotFoundException('كود الخصم غير موجود');

    await this.prisma.$transaction([
      this.prisma.promoCode.update({
        where: { id: promoCodeId },
        data: { currentUses: { increment: 1 } },
      }),
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { promoCodeId },
      }),
    ]);

    this.events.emit('promo.applied', { promoCodeId, bookingId });
    return { success: true };
  }

  async update(id: string, data: UpdatePromoDto) {
    const promoCode = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!promoCode) throw new NotFoundException('كود الخصم غير موجود');

    const updated = await this.prisma.promoCode.update({
      where: { id },
      data: {
        ...(data.discountType !== undefined && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.maxUses !== undefined && { maxUses: data.maxUses }),
        ...(data.maxUsesPerUser !== undefined && { maxUsesPerUser: data.maxUsesPerUser }),
        ...(data.minBookingDays !== undefined && { minBookingDays: data.minBookingDays }),
        ...(data.minBookingAmount !== undefined && { minBookingAmount: data.minBookingAmount }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    this.events.emit('promo.updated', updated);
    return { success: true, data: updated };
  }

  async deactivate(id: string) {
    const promoCode = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!promoCode) throw new NotFoundException('كود الخصم غير موجود');

    const updated = await this.prisma.promoCode.update({
      where: { id },
      data: { isActive: false },
    });

    this.events.emit('promo.deactivated', updated);
    return { success: true, data: updated };
  }
}
