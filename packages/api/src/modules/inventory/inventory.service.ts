import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    type?: string;
    region?: string;
    sleeps?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }) {
    const { page = 1, limit = 12, type, region, sleeps, minPrice, maxPrice, search, sort } = query;
    const where: any = { status: 'ACTIVE' };

    if (type) where.type = type;
    if (sleeps) where.sleeps = { gte: Number(sleeps) };
    if (minPrice || maxPrice) {
      where.dailyRate = {};
      if (minPrice) where.dailyRate.gte = Number(minPrice);
      if (maxPrice) where.dailyRate.lte = Number(maxPrice);
    }
    if (region) {
      where.pickupLocation = { region };
    }
    if (search) {
      where.OR = [
        { titleAr: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Check cache for listing queries
    const cacheKey = `caravans:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { dailyRate: 'asc' };
    else if (sort === 'price_desc') orderBy = { dailyRate: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [caravans, total] = await Promise.all([
      this.prisma.caravan.findMany({
        where,
        include: {
          media: { orderBy: { sortOrder: 'asc' }, take: 5 },
          pickupLocation: true,
          owner: { select: { companyNameAr: true, companyNameEn: true, user: { select: { fullNameAr: true, avatarUrl: true } } } },
        },
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.caravan.count({ where }),
    ]);

    const result = {
      success: true,
      data: caravans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };

    await this.cache.set(cacheKey, result, 300); // 5 min cache
    return result;
  }

  async findOne(id: string) {
    const cachedCaravan = await this.cache.get(`caravan:${id}`);
    if (cachedCaravan) return cachedCaravan;

    const caravan = await this.prisma.caravan.findUnique({
      where: { id },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
        pickupLocation: true,
        owner: {
          select: {
            companyNameAr: true,
            companyNameEn: true,
            bio: true,
            user: { select: { fullNameAr: true, fullNameEn: true, avatarUrl: true, createdAt: true } },
          },
        },
        reviews: {
          include: { customer: { select: { fullNameAr: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        pricingRules: { where: { isActive: true } },
        documents: { where: { isVerified: true }, select: { type: true, expiryDate: true } },
      },
    });

    if (!caravan) throw new NotFoundException('الكرفان غير موجود');

    const result = { success: true, data: caravan };
    await this.cache.set(`caravan:${id}`, result, 300);
    return result;
  }

  async findFeatured() {
    const caravans = await this.prisma.caravan.findMany({
      where: { status: 'ACTIVE' },
      include: {
        media: { orderBy: { sortOrder: 'asc' }, take: 1 },
        pickupLocation: true,
      },
      orderBy: { rating: 'desc' },
      take: 6,
    });

    return { success: true, data: caravans };
  }

  async create(ownerId: string, data: any) {
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId: ownerId } });
    if (!owner) {
      throw new NotFoundException('يجب إنشاء ملف مالك أولاً');
    }

    const caravan = await this.prisma.caravan.create({
      data: {
        ...data,
        ownerId: owner.id,
        status: 'PENDING_REVIEW',
      },
      include: { media: true },
    });

    await this.cache.invalidate('caravans:*');
    return { success: true, data: caravan };
  }

  async update(id: string, ownerId: string, data: any) {
    const caravan = await this.prisma.caravan.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!caravan) throw new NotFoundException('الكرفان غير موجود');
    if (caravan.owner.userId !== ownerId) throw new NotFoundException('غير مصرح');

    const updated = await this.prisma.caravan.update({
      where: { id },
      data,
      include: { media: true },
    });

    await this.cache.invalidate('caravans:*');
    await this.cache.invalidate(`caravan:${id}`);
    return { success: true, data: updated };
  }

  async findByOwner(userId: string, query: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = query;
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) throw new NotFoundException('يجب إنشاء ملف مالك أولاً');

    const where: any = { ownerId: owner.id };
    if (status) where.status = status;

    const [caravans, total] = await Promise.all([
      this.prisma.caravan.findMany({
        where,
        include: {
          media: { orderBy: { sortOrder: 'asc' }, take: 3 },
          pickupLocation: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      this.prisma.caravan.count({ where }),
    ]);

    return {
      success: true,
      data: caravans,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async softDelete(id: string, userId: string) {
    const caravan = await this.prisma.caravan.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!caravan) throw new NotFoundException('الكرفان غير موجود');
    if (caravan.owner.userId !== userId) throw new NotFoundException('غير مصرح');

    await this.prisma.caravan.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });

    await this.cache.invalidate('caravans:*');
    await this.cache.invalidate(`caravan:${id}`);
    return { success: true, message: 'تم إلغاء تنشيط الكرفان' };
  }

  async addReview(caravanId: string, userId: string, data: { rating: number; comment?: string }) {
    const caravan = await this.prisma.caravan.findUnique({ where: { id: caravanId } });
    if (!caravan) throw new NotFoundException('الكرفان غير موجود');

    const completedBooking = await this.prisma.booking.findFirst({
      where: { customerId: userId, caravanId, status: 'COMPLETED' },
    });
    if (!completedBooking) throw new NotFoundException('يجب إكمال حجز قبل التقييم');

    const existingReview = await this.prisma.review.findFirst({
      where: { customerId: userId, caravanId },
    });
    if (existingReview) throw new NotFoundException('لقد قمت بتقييم هذا الكرفان مسبقاً');

    const review = await this.prisma.review.create({
      data: {
        caravanId,
        customerId: userId,
        bookingId: completedBooking.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Update caravan average rating
    const { _avg, _count } = await this.prisma.review.aggregate({
      where: { caravanId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.caravan.update({
      where: { id: caravanId },
      data: {
        rating: _avg.rating ?? 0,
        reviewCount: _count.rating,
      },
    });

    await this.cache.invalidate(`caravan:${caravanId}`);
    return { success: true, data: review };
  }
}
