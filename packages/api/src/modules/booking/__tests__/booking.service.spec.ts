import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookingService } from '../booking.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

describe('BookingService', () => {
  let service: BookingService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;
  let mockAvailability: any;
  let mockPricing: any;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    mockAvailability = {
      checkAvailability: vi.fn().mockResolvedValue(true),
      markBooked: vi.fn().mockResolvedValue(undefined),
    };
    mockPricing = {
      calculatePrice: vi.fn().mockResolvedValue({
        data: {
          days: 3,
          weekdays: 3,
          weekendDays: 0,
          basePrice: 600,
          discountAmount: 0,
          subtotal: 600,
          vat: 90,
          total: 690,
          securityDeposit: 1000,
        },
      }),
    };
    service = new BookingService(prisma as any, mockAvailability, mockPricing, events as any);
  });

  describe('create', () => {
    const customerId = 'customer-123';
    const bookingData = {
      caravanId: 'caravan-456',
      startDate: '2026-04-10T00:00:00.000Z',
      endDate: '2026-04-13T00:00:00.000Z',
      addons: [],
    };

    beforeEach(() => {
      prisma.caravan.findUniqueOrThrow.mockResolvedValue({
        id: 'caravan-456',
        deliveryEnabled: false,
        deliveryFee: 0,
      });
      prisma.booking.create.mockResolvedValue({
        id: 'booking-789',
        bookingNumber: 'KRF-ABC123',
        customerId,
        caravanId: 'caravan-456',
        status: 'PENDING_PAYMENT',
        addons: [],
      });
    });

    it('creates a booking successfully', async () => {
      const result = await service.create(customerId, bookingData);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(prisma.booking.create).toHaveBeenCalledOnce();
    });

    it('checks availability before creating booking', async () => {
      await service.create(customerId, bookingData);
      expect(mockAvailability.checkAvailability).toHaveBeenCalledWith(
        'caravan-456',
        expect.any(Date),
        expect.any(Date),
      );
    });

    it('throws BadRequestException when caravan is not available', async () => {
      mockAvailability.checkAvailability.mockResolvedValue(false);
      await expect(service.create(customerId, bookingData)).rejects.toThrow(BadRequestException);
    });

    it('calculates addons price correctly', async () => {
      const dataWithAddons = {
        ...bookingData,
        addons: [
          { nameAr: 'كراسي', nameEn: 'Chairs', quantity: 2, unitPrice: 50 },
          { nameAr: 'طاولة', nameEn: 'Table', quantity: 1, unitPrice: 100 },
        ],
      };

      await service.create(customerId, dataWithAddons);

      const createCall = prisma.booking.create.mock.calls[0][0];
      expect(createCall.data.addonsPrice).toBe(200); // (2*50) + (1*100)
    });

    it('includes delivery fee when delivery address provided and enabled', async () => {
      prisma.caravan.findUniqueOrThrow.mockResolvedValue({
        id: 'caravan-456',
        deliveryEnabled: true,
        deliveryFee: 150,
      });

      const dataWithDelivery = { ...bookingData, deliveryAddress: 'Riyadh' };
      await service.create(customerId, dataWithDelivery);

      const createCall = prisma.booking.create.mock.calls[0][0];
      expect(createCall.data.deliveryPrice).toBe(150);
    });

    it('sets delivery price to 0 when no delivery address', async () => {
      await service.create(customerId, bookingData);
      const createCall = prisma.booking.create.mock.calls[0][0];
      expect(createCall.data.deliveryPrice).toBe(0);
    });

    it('emits booking.created event', async () => {
      await service.create(customerId, bookingData);
      expect(events.emit).toHaveBeenCalledWith('booking.created', expect.any(Object));
    });

    it('marks dates as booked after creation', async () => {
      await service.create(customerId, bookingData);
      expect(mockAvailability.markBooked).toHaveBeenCalledWith(
        'caravan-456',
        expect.any(Date),
        expect.any(Date),
      );
    });
  });

  describe('cancel', () => {
    const userId = 'user-123';

    it('cancels a PENDING_PAYMENT booking successfully', async () => {
      prisma.booking.findUnique.mockResolvedValue({
        id: 'booking-1',
        customerId: userId,
        status: 'PENDING_PAYMENT',
      });
      prisma.booking.update.mockResolvedValue({ id: 'booking-1', status: 'CANCELLED' });

      const result = await service.cancel('booking-1', userId, 'Changed plans');
      expect(result.success).toBe(true);
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { status: 'CANCELLED', cancellationReason: 'Changed plans' },
      });
    });

    it('cancels a CONFIRMED booking successfully', async () => {
      prisma.booking.findUnique.mockResolvedValue({
        id: 'booking-1',
        customerId: userId,
        status: 'CONFIRMED',
      });
      prisma.booking.update.mockResolvedValue({ id: 'booking-1', status: 'CANCELLED' });

      const result = await service.cancel('booking-1', userId);
      expect(result.success).toBe(true);
    });

    it('throws BadRequestException when cancelling ACTIVE booking', async () => {
      prisma.booking.findUnique.mockResolvedValue({
        id: 'booking-1',
        customerId: userId,
        status: 'ACTIVE',
      });
      await expect(service.cancel('booking-1', userId)).rejects.toThrow(BadRequestException);
    });

    it('throws ForbiddenException when cancelling another user booking', async () => {
      prisma.booking.findUnique.mockResolvedValue({
        id: 'booking-1',
        customerId: 'other-user',
        status: 'PENDING_PAYMENT',
      });
      await expect(service.cancel('booking-1', userId)).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.cancel('nonexistent', userId)).rejects.toThrow(NotFoundException);
    });

    it('emits booking.cancelled event', async () => {
      prisma.booking.findUnique.mockResolvedValue({
        id: 'booking-1',
        customerId: userId,
        status: 'PENDING_PAYMENT',
      });
      prisma.booking.update.mockResolvedValue({ id: 'booking-1', status: 'CANCELLED' });

      await service.cancel('booking-1', userId);
      expect(events.emit).toHaveBeenCalledWith('booking.cancelled', expect.any(Object));
    });
  });

  describe('updateStatus', () => {
    it('allows valid transition PENDING_PAYMENT -> CONFIRMED', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PENDING_PAYMENT' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });

      const result = await service.updateStatus('b1', 'CONFIRMED');
      expect(result.success).toBe(true);
    });

    it('allows valid transition CONFIRMED -> PREPARING', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'PREPARING' });

      const result = await service.updateStatus('b1', 'PREPARING');
      expect(result.success).toBe(true);
    });

    it('throws BadRequestException for invalid transition', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PENDING_PAYMENT' });
      await expect(service.updateStatus('b1', 'ACTIVE')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for transition from CANCELLED', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'CANCELLED' });
      await expect(service.updateStatus('b1', 'CONFIRMED')).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('nonexistent', 'CONFIRMED')).rejects.toThrow(NotFoundException);
    });

    it('emits booking.statusChanged event with previousStatus', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PENDING_PAYMENT' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });

      await service.updateStatus('b1', 'CONFIRMED');
      expect(events.emit).toHaveBeenCalledWith('booking.statusChanged', {
        booking: expect.objectContaining({ status: 'CONFIRMED' }),
        previousStatus: 'PENDING_PAYMENT',
      });
    });

    it('validates complete lifecycle path', async () => {
      const transitions = [
        ['PENDING_PAYMENT', 'CONFIRMED'],
        ['CONFIRMED', 'PREPARING'],
        ['PREPARING', 'DISPATCHED'],
        ['DISPATCHED', 'HANDED_OVER'],
        ['HANDED_OVER', 'ACTIVE'],
        ['ACTIVE', 'RETURN_PENDING'],
        ['RETURN_PENDING', 'RETURNED'],
        ['RETURNED', 'POST_INSPECTION'],
        ['POST_INSPECTION', 'COMPLETED'],
      ];

      for (const [from, to] of transitions) {
        prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: from });
        prisma.booking.update.mockResolvedValue({ id: 'b1', status: to });
        const result = await service.updateStatus('b1', to);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('findByUser', () => {
    it('returns paginated results', async () => {
      prisma.booking.findMany.mockResolvedValue([{ id: 'b1' }, { id: 'b2' }]);
      prisma.booking.count.mockResolvedValue(2);

      const result = await service.findByUser('user-123', {});
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total).toBe(2);
    });

    it('filters by status when provided', async () => {
      prisma.booking.findMany.mockResolvedValue([]);
      prisma.booking.count.mockResolvedValue(0);

      await service.findByUser('user-123', { status: 'CONFIRMED' });
      const findCall = prisma.booking.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('CONFIRMED');
    });

    it('uses default pagination values', async () => {
      prisma.booking.findMany.mockResolvedValue([]);
      prisma.booking.count.mockResolvedValue(0);

      const result = await service.findByUser('user-123', {});
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });
  });

  describe('findOne', () => {
    it('returns booking with all relations', async () => {
      prisma.booking.findUnique.mockResolvedValue({
        id: 'b1',
        caravan: { media: [] },
        addons: [],
        payments: [],
      });

      const result = await service.findOne('b1');
      expect(result.success).toBe(true);
      expect(result.data.id).toBe('b1');
    });

    it('throws NotFoundException when booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
