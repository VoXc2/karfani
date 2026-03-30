import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getOwnerAnalytics(userId: string) {
    const owner = await this.prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) throw new NotFoundException('يجب إنشاء ملف مالك أولاً');

    const cacheKey = `analytics:owner:${owner.id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return { success: true, data: cached };

    const [totalBookings, activeCaravans, revenueResult, avgRating, recentBookings] = await Promise.all([
      this.prisma.booking.count({ where: { caravan: { ownerId: owner.id } } }),
      this.prisma.caravan.count({ where: { ownerId: owner.id, status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED', type: 'BOOKING_PAYMENT', booking: { caravan: { ownerId: owner.id } } },
        _sum: { amount: true },
      }),
      this.prisma.review.aggregate({
        where: { caravan: { ownerId: owner.id } },
        _avg: { rating: true },
      }),
      this.prisma.booking.count({
        where: {
          caravan: { ownerId: owner.id },
          createdAt: { gte: new Date(new Date().setDate(1)) },
        },
      }),
    ]);

    const data = {
      totalBookings,
      totalRevenue: Number(revenueResult._sum.amount || 0),
      activeCaravans,
      averageRating: Number(avgRating._avg.rating || 0),
      monthlyBookings: recentBookings,
    };

    await this.cache.set(cacheKey, data, 600);
    return { success: true, data };
  }

  async getOverview() {
    const cacheKey = 'analytics:overview';
    const cached = await this.cache.get(cacheKey);
    if (cached) return { success: true, data: cached };

    const [totalBookings, totalUsers, activeCaravans, revenueResult, avgRating] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.user.count(),
      this.prisma.caravan.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED', type: 'BOOKING_PAYMENT' },
        _sum: { amount: true },
      }),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    const data = {
      totalBookings,
      totalRevenue: Number(revenueResult._sum.amount || 0),
      activeCaravans,
      averageRating: Number(avgRating._avg.rating || 0),
      totalUsers,
    };

    await this.cache.set(cacheKey, data, 900);
    return { success: true, data };
  }

  async getRevenue(period: string) {
    const cacheKey = `analytics:revenue:${period}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return { success: true, data: cached };

    let dateFormat: string;
    switch (period) {
      case 'daily':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'weekly':
        dateFormat = 'IYYY-IW';
        break;
      case 'monthly':
      default:
        dateFormat = 'YYYY-MM';
        break;
    }

    const revenue = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT to_char(p."paidAt", '${dateFormat}') as period,
              SUM(p.amount) as total,
              COUNT(p.id) as count
       FROM payments p
       WHERE p.status = 'COMPLETED' AND p.type = 'BOOKING_PAYMENT' AND p."paidAt" IS NOT NULL
       GROUP BY period
       ORDER BY period DESC
       LIMIT 24`,
    );

    const data = revenue.map((r) => ({
      period: r.period,
      total: Number(r.total),
      count: Number(r.count),
    }));

    await this.cache.set(cacheKey, data, 900);
    return { success: true, data };
  }

  async getBookingStats(period: string) {
    const cacheKey = `analytics:bookings:${period}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return { success: true, data: cached };

    const [statusCounts, recentBookings] = await Promise.all([
      this.prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT to_char(b."createdAt", 'YYYY-MM') as period,
                COUNT(b.id) as count
         FROM bookings b
         GROUP BY period
         ORDER BY period DESC
         LIMIT 12`,
      ),
    ]);

    const data = {
      byStatus: statusCounts.map((s) => ({ status: s.status, count: s._count.id })),
      byPeriod: recentBookings.map((r) => ({ period: r.period, count: Number(r.count) })),
    };

    await this.cache.set(cacheKey, data, 900);
    return { success: true, data };
  }

  async getCaravanPerformance() {
    const cacheKey = 'analytics:caravans';
    const cached = await this.cache.get(cacheKey);
    if (cached) return { success: true, data: cached };

    const topCaravans = await this.prisma.caravan.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        rating: true,
        reviewCount: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { bookings: { _count: 'desc' } },
      take: 20,
    });

    const data = topCaravans.map((c) => ({
      id: c.id,
      titleAr: c.titleAr,
      titleEn: c.titleEn,
      rating: c.rating ? Number(c.rating) : null,
      reviewCount: c.reviewCount,
      totalBookings: c._count.bookings,
    }));

    await this.cache.set(cacheKey, data, 900);
    return { success: true, data };
  }
}
