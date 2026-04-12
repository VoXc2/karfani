import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { InventoryService } from '../inventory.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockCacheService, type MockCacheService } from '../../../../test/helpers/cache-mock';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: MockPrismaService;
  let cache: MockCacheService;

  beforeEach(() => {
    prisma = createMockPrismaService();
    cache = createMockCacheService();
    service = new InventoryService(prisma as any, cache as any);
  });

  describe('findAll', () => {
    const mockCaravans = [
      { id: 'c1', titleAr: '\u0643\u0631\u0641\u0627\u0646 1', dailyRate: 200, status: 'ACTIVE' },
      { id: 'c2', titleAr: '\u0643\u0631\u0641\u0627\u0646 2', dailyRate: 350, status: 'ACTIVE' },
    ];

    beforeEach(() => {
      prisma.caravan.findMany.mockResolvedValue(mockCaravans);
      prisma.caravan.count.mockResolvedValue(2);
    });

    it('returns paginated list of caravans', async () => {
      const result = await service.findAll({});
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total).toBe(2);
    });

    it('uses default pagination values', async () => {
      const result = await service.findAll({});
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(12);
    });

    it('applies custom pagination', async () => {
      prisma.caravan.findMany.mockResolvedValue([mockCaravans[0]]);
      prisma.caravan.count.mockResolvedValue(10);

      const result = await service.findAll({ page: 2, limit: 5 });
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(5);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('filters by type when provided', async () => {
      await service.findAll({ type: 'MOTORHOME' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.type).toBe('MOTORHOME');
    });

    it('filters by minimum sleeps when provided', async () => {
      await service.findAll({ sleeps: 4 });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.sleeps).toEqual({ gte: 4 });
    });

    it('filters by price range when provided', async () => {
      await service.findAll({ minPrice: 100, maxPrice: 500 });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.dailyRate.gte).toBe(100);
      expect(findCall.where.dailyRate.lte).toBe(500);
    });

    it('filters by region when provided', async () => {
      await service.findAll({ region: 'Riyadh' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.pickupLocation).toEqual({ region: 'Riyadh' });
    });

    it('applies search filter across title and description fields', async () => {
      await service.findAll({ search: '\u0643\u0631\u0641\u0627\u0646' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.OR).toBeDefined();
      expect(findCall.where.OR).toHaveLength(3);
    });

    it('sorts by price ascending when sort is price_asc', async () => {
      await service.findAll({ sort: 'price_asc' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.orderBy).toEqual({ dailyRate: 'asc' });
    });

    it('sorts by price descending when sort is price_desc', async () => {
      await service.findAll({ sort: 'price_desc' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.orderBy).toEqual({ dailyRate: 'desc' });
    });

    it('sorts by rating when sort is rating', async () => {
      await service.findAll({ sort: 'rating' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.orderBy).toEqual({ rating: 'desc' });
    });

    it('defaults to sorting by createdAt desc', async () => {
      await service.findAll({});
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.orderBy).toEqual({ createdAt: 'desc' });
    });

    it('returns cached result when available', async () => {
      const cachedResult = { success: true, data: mockCaravans, pagination: { page: 1, limit: 12, total: 2, totalPages: 1 } };
      cache.get.mockResolvedValue(cachedResult);

      const result = await service.findAll({});
      expect(result).toBe(cachedResult);
      expect(prisma.caravan.findMany).not.toHaveBeenCalled();
    });

    it('stores result in cache after fetching from database', async () => {
      await service.findAll({});
      expect(cache.set).toHaveBeenCalledWith(
        expect.stringContaining('caravans:'),
        expect.objectContaining({ success: true }),
        300,
      );
    });

    it('only returns ACTIVE caravans', async () => {
      await service.findAll({});
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('ACTIVE');
    });
  });

  describe('findOne', () => {
    const mockCaravan = {
      id: 'caravan-1',
      titleAr: '\u0643\u0631\u0641\u0627\u0646 \u0641\u0627\u062E\u0631',
      titleEn: 'Luxury Caravan',
      dailyRate: 500,
      media: [],
      pickupLocation: { city: 'Riyadh' },
      owner: { companyNameAr: '\u0634\u0631\u0643\u0629' },
      reviews: [],
      pricingRules: [],
      documents: [],
    };

    it('returns caravan with all relations', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);

      const result = await service.findOne('caravan-1');
      expect(result.success).toBe(true);
      expect(result.data.id).toBe('caravan-1');
      expect(result.data.titleAr).toBe('\u0643\u0631\u0641\u0627\u0646 \u0641\u0627\u062E\u0631');
    });

    it('throws NotFoundException when caravan does not exist', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('returns cached caravan when available', async () => {
      const cachedResult = { success: true, data: mockCaravan };
      cache.get.mockResolvedValue(cachedResult);

      const result = await service.findOne('caravan-1');
      expect(result).toBe(cachedResult);
      expect(prisma.caravan.findUnique).not.toHaveBeenCalled();
    });

    it('caches the result after fetching from database', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);

      await service.findOne('caravan-1');
      expect(cache.set).toHaveBeenCalledWith('caravan:caravan-1', expect.objectContaining({ success: true }), 300);
    });
  });

  describe('findFeatured', () => {
    it('returns top 6 caravans sorted by rating', async () => {
      const featured = [
        { id: 'c1', rating: 4.9 },
        { id: 'c2', rating: 4.8 },
        { id: 'c3', rating: 4.7 },
        { id: 'c4', rating: 4.6 },
        { id: 'c5', rating: 4.5 },
        { id: 'c6', rating: 4.4 },
      ];
      prisma.caravan.findMany.mockResolvedValue(featured);

      const result = await service.findFeatured();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(6);
    });

    it('queries only ACTIVE caravans ordered by rating desc', async () => {
      prisma.caravan.findMany.mockResolvedValue([]);

      await service.findFeatured();
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where).toEqual({ status: 'ACTIVE' });
      expect(findCall.orderBy).toEqual({ rating: 'desc' });
      expect(findCall.take).toBe(6);
    });
  });

  describe('create', () => {
    const ownerId = 'owner-user-1';
    const ownerProfile = { id: 'profile-1', userId: ownerId };
    const caravanData = {
      titleAr: '\u0643\u0631\u0641\u0627\u0646 \u062C\u062F\u064A\u062F',
      titleEn: 'New Caravan',
      dailyRate: 300,
      type: 'TRAILER',
      sleeps: 4,
    };

    it('creates a caravan successfully', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.create.mockResolvedValue({
        id: 'new-caravan-1',
        ...caravanData,
        ownerId: 'profile-1',
        status: 'PENDING_REVIEW',
        media: [],
      });

      const result = await service.create(ownerId, caravanData);
      expect(result.success).toBe(true);
      expect(result.data.id).toBe('new-caravan-1');
      expect(result.data.status).toBe('PENDING_REVIEW');
    });

    it('sets status to PENDING_REVIEW on creation', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.create.mockResolvedValue({ id: 'c1', status: 'PENDING_REVIEW', media: [] });

      await service.create(ownerId, caravanData);
      const createCall = prisma.caravan.create.mock.calls[0][0];
      expect(createCall.data.status).toBe('PENDING_REVIEW');
    });

    it('throws NotFoundException when owner profile does not exist', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(null);
      await expect(service.create(ownerId, caravanData)).rejects.toThrow(NotFoundException);
    });

    it('invalidates caravans cache after creation', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.create.mockResolvedValue({ id: 'c1', media: [] });

      await service.create(ownerId, caravanData);
      expect(cache.invalidate).toHaveBeenCalledWith('caravans:*');
    });

    it('uses the owner profile id as ownerId', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.create.mockResolvedValue({ id: 'c1', media: [] });

      await service.create(ownerId, caravanData);
      const createCall = prisma.caravan.create.mock.calls[0][0];
      expect(createCall.data.ownerId).toBe('profile-1');
    });
  });

  describe('update', () => {
    const caravanId = 'caravan-1';
    const ownerId = 'owner-user-1';
    const mockCaravan = {
      id: caravanId,
      titleAr: '\u0643\u0631\u0641\u0627\u0646',
      owner: { id: 'profile-1', userId: ownerId },
    };

    it('updates a caravan successfully', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.caravan.update.mockResolvedValue({
        ...mockCaravan,
        titleAr: '\u0643\u0631\u0641\u0627\u0646 \u0645\u0639\u062F\u0644',
        media: [],
      });

      const result = await service.update(caravanId, ownerId, { titleAr: '\u0643\u0631\u0641\u0627\u0646 \u0645\u0639\u062F\u0644' });
      expect(result.success).toBe(true);
      expect(result.data.titleAr).toBe('\u0643\u0631\u0641\u0627\u0646 \u0645\u0639\u062F\u0644');
    });

    it('throws NotFoundException when caravan does not exist', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);
      await expect(service.update(caravanId, ownerId, {})).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when user is not the owner', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      await expect(service.update(caravanId, 'other-user', {})).rejects.toThrow(NotFoundException);
    });

    it('invalidates both listing and single caravan cache', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.caravan.update.mockResolvedValue({ ...mockCaravan, media: [] });

      await service.update(caravanId, ownerId, { dailyRate: 400 });
      expect(cache.invalidate).toHaveBeenCalledWith('caravans:*');
      expect(cache.invalidate).toHaveBeenCalledWith(`caravan:${caravanId}`);
    });
  });

  describe('findByOwner', () => {
    const userId = 'owner-user-1';
    const ownerProfile = { id: 'profile-1', userId };

    it('returns paginated caravans for an owner', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.findMany.mockResolvedValue([
        { id: 'c1', titleAr: '\u0643\u0631\u0641\u0627\u0646 1' },
        { id: 'c2', titleAr: '\u0643\u0631\u0641\u0627\u0646 2' },
      ]);
      prisma.caravan.count.mockResolvedValue(2);

      const result = await service.findByOwner(userId, {});
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('throws NotFoundException when owner profile does not exist', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(null);
      await expect(service.findByOwner(userId, {})).rejects.toThrow(NotFoundException);
    });

    it('uses default pagination of page 1, limit 20', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.findMany.mockResolvedValue([]);
      prisma.caravan.count.mockResolvedValue(0);

      const result = await service.findByOwner(userId, {});
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('filters by status when provided', async () => {
      prisma.ownerProfile.findUnique.mockResolvedValue(ownerProfile);
      prisma.caravan.findMany.mockResolvedValue([]);
      prisma.caravan.count.mockResolvedValue(0);

      await service.findByOwner(userId, { status: 'ACTIVE' });
      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('ACTIVE');
    });
  });

  describe('softDelete', () => {
    const caravanId = 'caravan-1';
    const userId = 'owner-user-1';
    const mockCaravan = {
      id: caravanId,
      status: 'ACTIVE',
      owner: { id: 'profile-1', userId },
    };

    it('sets caravan status to SUSPENDED', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.caravan.update.mockResolvedValue({ ...mockCaravan, status: 'SUSPENDED' });

      const result = await service.softDelete(caravanId, userId);
      expect(result.success).toBe(true);
      expect(prisma.caravan.update).toHaveBeenCalledWith({
        where: { id: caravanId },
        data: { status: 'SUSPENDED' },
      });
    });

    it('throws NotFoundException when caravan does not exist', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);
      await expect(service.softDelete(caravanId, userId)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when user is not the owner', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      await expect(service.softDelete(caravanId, 'other-user')).rejects.toThrow(NotFoundException);
    });

    it('invalidates both listing and single caravan cache', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.caravan.update.mockResolvedValue({ ...mockCaravan, status: 'SUSPENDED' });

      await service.softDelete(caravanId, userId);
      expect(cache.invalidate).toHaveBeenCalledWith('caravans:*');
      expect(cache.invalidate).toHaveBeenCalledWith(`caravan:${caravanId}`);
    });

    it('returns a success message in Arabic', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.caravan.update.mockResolvedValue({ ...mockCaravan, status: 'SUSPENDED' });

      const result = await service.softDelete(caravanId, userId);
      expect(result.message).toBe('\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u062A\u0646\u0634\u064A\u0637 \u0627\u0644\u0643\u0631\u0641\u0627\u0646');
    });
  });

  describe('addReview', () => {
    const caravanId = 'caravan-1';
    const userId = 'user-1';
    const reviewData = { rating: 5, comment: '\u0645\u0645\u062A\u0627\u0632' };
    const mockCaravan = { id: caravanId, rating: 4.0, reviewCount: 3 };
    const mockBooking = { id: 'booking-1', customerId: userId, caravanId, status: 'COMPLETED' };

    it('creates a review successfully', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.booking.findFirst.mockResolvedValue(mockBooking);
      prisma.review.findFirst.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({
        id: 'review-1',
        caravanId,
        customerId: userId,
        bookingId: 'booking-1',
        rating: 5,
        comment: '\u0645\u0645\u062A\u0627\u0632',
      });
      prisma.review.aggregate.mockResolvedValue({
        _avg: { rating: 4.25 },
        _count: { rating: 4 },
      });
      prisma.caravan.update.mockResolvedValue({});

      const result = await service.addReview(caravanId, userId, reviewData);
      expect(result.success).toBe(true);
      expect(result.data.rating).toBe(5);
    });

    it('throws NotFoundException when caravan does not exist', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);
      await expect(service.addReview(caravanId, userId, reviewData)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when user has no completed booking', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.booking.findFirst.mockResolvedValue(null);
      await expect(service.addReview(caravanId, userId, reviewData)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when user already reviewed the caravan', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.booking.findFirst.mockResolvedValue(mockBooking);
      prisma.review.findFirst.mockResolvedValue({ id: 'existing-review' });
      await expect(service.addReview(caravanId, userId, reviewData)).rejects.toThrow(NotFoundException);
    });

    it('updates the caravan average rating after review', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.booking.findFirst.mockResolvedValue(mockBooking);
      prisma.review.findFirst.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({ id: 'review-1', rating: 5 });
      prisma.review.aggregate.mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: { rating: 4 },
      });
      prisma.caravan.update.mockResolvedValue({});

      await service.addReview(caravanId, userId, reviewData);

      expect(prisma.caravan.update).toHaveBeenCalledWith({
        where: { id: caravanId },
        data: {
          rating: 4.5,
          reviewCount: 4,
        },
      });
    });

    it('invalidates caravan cache after review', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.booking.findFirst.mockResolvedValue(mockBooking);
      prisma.review.findFirst.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({ id: 'review-1', rating: 5 });
      prisma.review.aggregate.mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: { rating: 4 },
      });
      prisma.caravan.update.mockResolvedValue({});

      await service.addReview(caravanId, userId, reviewData);
      expect(cache.invalidate).toHaveBeenCalledWith(`caravan:${caravanId}`);
    });

    it('links the review to the completed booking', async () => {
      prisma.caravan.findUnique.mockResolvedValue(mockCaravan);
      prisma.booking.findFirst.mockResolvedValue(mockBooking);
      prisma.review.findFirst.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({ id: 'review-1' });
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: { rating: 1 } });
      prisma.caravan.update.mockResolvedValue({});

      await service.addReview(caravanId, userId, reviewData);

      expect(prisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          bookingId: 'booking-1',
          caravanId,
          customerId: userId,
        }),
      });
    });
  });
});
