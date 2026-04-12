import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { AnalyticsService } from '../analytics.service';
import { createMockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockCacheService } from '../../../../test/helpers/cache-mock';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: ReturnType<typeof createMockPrismaService>;
  let cache: ReturnType<typeof createMockCacheService>;

  beforeEach(() => {
    prisma = createMockPrismaService();
    cache = createMockCacheService();
    service = new AnalyticsService(prisma as any, cache as any);
  });

  describe('getOwnerAnalytics', () => {
    const userId = 'user-001';
    const ownerId = 'owner-001';

    beforeEach(() => {
      prisma.ownerProfile.findUnique.mockResolvedValue({ id: ownerId, userId });
      prisma.booking.count
        .mockResolvedValueOnce(25)
        .mockResolvedValueOnce(8);
      prisma.caravan.count.mockResolvedValue(3);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 75000 } });
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });
    });

    it('returns owner analytics data', async () => {
      const result = await service.getOwnerAnalytics(userId);

      expect(result.success).toBe(true);
      expect(result.data.totalBookings).toBe(25);
      expect(result.data.totalRevenue).toBe(75000);
      expect(result.data.activeCaravans).toBe(3);
      expect(result.data.averageRating).toBe(4.5);
      expect(result.data.monthlyBookings).toBe(8);
    });

    it('caches the result with 600 second TTL', async () => {
      await service.getOwnerAnalytics(userId);

      expect(cache.set).toHaveBeenCalledWith(
        `analytics:owner:${ownerId}`,
        expect.objectContaining({ totalBookings: 25, totalRevenue: 75000 }),
        600,
      );
    });

    it('returns cached data when available and skips DB queries', async () => {
      const cachedData = { totalBookings: 10, totalRevenue: 50000, activeCaravans: 2, averageRating: 4.0, monthlyBookings: 3 };
      cache.get.mockResolvedValue(cachedData);

      const result = await service.getOwnerAnalytics(userId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(cachedData);
      expect(prisma.booking.count).not.toHaveBeenCalled();
      expect(prisma.caravan.count).not.toHaveBeenCalled();
      expect(prisma.payment.aggregate).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when owner profile does not exist', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(null);

      await expect(service.getOwnerAnalytics(userId)).rejects.toThrow(NotFoundException);
    });

    it('handles null rating gracefully', async () => {
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });

      const result = await service.getOwnerAnalytics(userId);

      expect(result.data.averageRating).toBe(0);
    });

    it('handles null revenue gracefully', async () => {
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: null } });

      const result = await service.getOwnerAnalytics(userId);

      expect(result.data.totalRevenue).toBe(0);
    });
  });

  describe('getOverview', () => {
    beforeEach(() => {
      prisma.booking.count.mockResolvedValue(500);
      prisma.user.count.mockResolvedValue(200);
      prisma.caravan.count.mockResolvedValue(40);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 300000 } });
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.2 } });
    });

    it('returns platform overview data', async () => {
      const result = await service.getOverview();

      expect(result.success).toBe(true);
      expect(result.data.totalBookings).toBe(500);
      expect(result.data.totalUsers).toBe(200);
      expect(result.data.activeCaravans).toBe(40);
      expect(result.data.totalRevenue).toBe(300000);
      expect(result.data.averageRating).toBe(4.2);
    });

    it('caches overview with 900 second TTL', async () => {
      await service.getOverview();

      expect(cache.set).toHaveBeenCalledWith('analytics:overview', expect.any(Object), 900);
    });

    it('returns cached data when available and skips DB queries', async () => {
      const cachedData = { totalBookings: 100, totalUsers: 50, activeCaravans: 10, totalRevenue: 80000, averageRating: 3.9 };
      cache.get.mockResolvedValue(cachedData);

      const result = await service.getOverview();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(cachedData);
      expect(prisma.booking.count).not.toHaveBeenCalled();
      expect(prisma.user.count).not.toHaveBeenCalled();
    });

    it('handles null revenue gracefully', async () => {
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: null } });

      const result = await service.getOverview();

      expect(result.data.totalRevenue).toBe(0);
    });
  });

  describe('getRevenue', () => {
    it('returns revenue data for monthly period', async () => {
      const rawData = [
        { period: '2026-03', total: 50000, count: 15 },
        { period: '2026-02', total: 40000, count: 12 },
      ];
      prisma.$queryRawUnsafe.mockResolvedValue(rawData);

      const result = await service.getRevenue('monthly');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].period).toBe('2026-03');
      expect(result.data[0].total).toBe(50000);
      expect(result.data[0].count).toBe(15);
    });

    it('uses $queryRawUnsafe for the revenue query', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([]);

      await service.getRevenue('daily');

      expect(prisma.$queryRawUnsafe).toHaveBeenCalledOnce();
      expect(prisma.$queryRawUnsafe).toHaveBeenCalledWith(expect.stringContaining('YYYY-MM-DD'));
    });

    it('caches revenue data with period-specific key', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([]);

      await service.getRevenue('daily');

      expect(cache.set).toHaveBeenCalledWith('analytics:revenue:daily', expect.any(Array), 900);
    });

    it('returns cached revenue when available', async () => {
      const cachedData = [{ period: '2026-03', total: 10000, count: 5 }];
      cache.get.mockResolvedValue(cachedData);

      const result = await service.getRevenue('weekly');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(cachedData);
      expect(prisma.$queryRawUnsafe).not.toHaveBeenCalled();
    });

    it('uses weekly format for weekly period', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([]);

      await service.getRevenue('weekly');

      expect(prisma.$queryRawUnsafe).toHaveBeenCalledWith(expect.stringContaining('IYYY-IW'));
    });
  });

  describe('getBookingStats', () => {
    it('returns booking stats by status and period', async () => {
      prisma.booking.groupBy.mockResolvedValue([
        { status: 'CONFIRMED', _count: { id: 30 } },
        { status: 'COMPLETED', _count: { id: 80 } },
        { status: 'CANCELLED', _count: { id: 10 } },
      ]);
      prisma.$queryRawUnsafe.mockResolvedValue([
        { period: '2026-03', count: 25 },
        { period: '2026-02', count: 20 },
      ]);

      const result = await service.getBookingStats('monthly');

      expect(result.success).toBe(true);
      expect(result.data.byStatus).toHaveLength(3);
      expect(result.data.byStatus[0]).toEqual({ status: 'CONFIRMED', count: 30 });
      expect(result.data.byStatus[1]).toEqual({ status: 'COMPLETED', count: 80 });
      expect(result.data.byPeriod).toHaveLength(2);
      expect(result.data.byPeriod[0]).toEqual({ period: '2026-03', count: 25 });
    });

    it('returns cached booking stats when available', async () => {
      const cachedData = { byStatus: [{ status: 'ACTIVE', count: 5 }], byPeriod: [] };
      cache.get.mockResolvedValue(cachedData);

      const result = await service.getBookingStats('monthly');

      expect(result.data).toEqual(cachedData);
      expect(prisma.booking.groupBy).not.toHaveBeenCalled();
      expect(prisma.$queryRawUnsafe).not.toHaveBeenCalled();
    });

    it('caches booking stats with period-specific key', async () => {
      prisma.booking.groupBy.mockResolvedValue([]);
      prisma.$queryRawUnsafe.mockResolvedValue([]);

      await service.getBookingStats('weekly');

      expect(cache.set).toHaveBeenCalledWith('analytics:bookings:weekly', expect.any(Object), 900);
    });
  });

  describe('getCaravanPerformance', () => {
    it('returns top caravans by bookings', async () => {
      prisma.caravan.findMany.mockResolvedValue([
        { id: 'c1', titleAr: 'كرفان فاخر', titleEn: 'Luxury Caravan', rating: 4.8, reviewCount: 15, _count: { bookings: 30 } },
        { id: 'c2', titleAr: 'كرفان عائلي', titleEn: 'Family Caravan', rating: null, reviewCount: 0, _count: { bookings: 20 } },
      ]);

      const result = await service.getCaravanPerformance();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].totalBookings).toBe(30);
      expect(result.data[0].rating).toBe(4.8);
      expect(result.data[0].titleAr).toBe('كرفان فاخر');
      expect(result.data[1].rating).toBeNull();
      expect(result.data[1].totalBookings).toBe(20);
    });

    it('caches caravan performance data with 900 second TTL', async () => {
      prisma.caravan.findMany.mockResolvedValue([]);

      await service.getCaravanPerformance();

      expect(cache.set).toHaveBeenCalledWith('analytics:caravans', expect.any(Array), 900);
    });

    it('returns cached data when available', async () => {
      const cachedData = [{ id: 'c1', totalBookings: 10, rating: 4.0 }];
      cache.get.mockResolvedValue(cachedData);

      const result = await service.getCaravanPerformance();

      expect(result.data).toEqual(cachedData);
      expect(prisma.caravan.findMany).not.toHaveBeenCalled();
    });
  });
});
