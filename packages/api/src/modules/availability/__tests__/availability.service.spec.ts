import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AvailabilityService } from '../availability.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let prisma: MockPrismaService;

  beforeEach(() => {
    prisma = createMockPrismaService();
    service = new AvailabilityService(prisma as any);
  });

  describe('checkAvailability', () => {
    it('returns true when all dates are available (no blocked slots)', async () => {
      prisma.availabilitySlot.count.mockResolvedValue(0);
      const result = await service.checkAvailability('caravan-1', new Date('2026-04-01'), new Date('2026-04-05'));
      expect(result).toBe(true);
    });

    it('returns false when some dates are blocked', async () => {
      prisma.availabilitySlot.count.mockResolvedValue(2);
      const result = await service.checkAvailability('caravan-1', new Date('2026-04-01'), new Date('2026-04-05'));
      expect(result).toBe(false);
    });

    it('queries correct date range', async () => {
      prisma.availabilitySlot.count.mockResolvedValue(0);
      const start = new Date('2026-04-01');
      const end = new Date('2026-04-05');
      await service.checkAvailability('caravan-1', start, end);

      expect(prisma.availabilitySlot.count).toHaveBeenCalledWith({
        where: {
          caravanId: 'caravan-1',
          date: { gte: start, lt: end },
          isAvailable: false,
        },
      });
    });
  });

  describe('blockDates', () => {
    it('creates blocked slots for each provided date', async () => {
      prisma.availabilitySlot.upsert.mockResolvedValue({});
      const dates = ['2026-04-01', '2026-04-02', '2026-04-03'];
      await service.blockDates('caravan-1', dates, 'maintenance');

      expect(prisma.availabilitySlot.upsert).toHaveBeenCalledTimes(3);
    });

    it('uses manual_block as default reason', async () => {
      prisma.availabilitySlot.upsert.mockResolvedValue({});
      await service.blockDates('caravan-1', ['2026-04-01']);

      const call = prisma.availabilitySlot.upsert.mock.calls[0][0];
      expect(call.update.blockReason).toBe('manual_block');
      expect(call.create.blockReason).toBe('manual_block');
    });

    it('uses custom reason when provided', async () => {
      prisma.availabilitySlot.upsert.mockResolvedValue({});
      await service.blockDates('caravan-1', ['2026-04-01'], 'maintenance');

      const call = prisma.availabilitySlot.upsert.mock.calls[0][0];
      expect(call.update.blockReason).toBe('maintenance');
    });
  });

  describe('markBooked', () => {
    it('creates a slot for each day in the range', async () => {
      prisma.availabilitySlot.upsert.mockResolvedValue({});
      const start = new Date('2026-04-01');
      const end = new Date('2026-04-04'); // 3 days

      await service.markBooked('caravan-1', start, end);
      expect(prisma.availabilitySlot.upsert).toHaveBeenCalledTimes(3);
    });

    it('sets blockReason to booked', async () => {
      prisma.availabilitySlot.upsert.mockResolvedValue({});
      await service.markBooked('caravan-1', new Date('2026-04-01'), new Date('2026-04-02'));

      const call = prisma.availabilitySlot.upsert.mock.calls[0][0];
      expect(call.create.blockReason).toBe('booked');
      expect(call.create.isAvailable).toBe(false);
    });
  });

  describe('getMonthAvailability', () => {
    it('returns slots for the specified month', async () => {
      const mockSlots = [
        { date: new Date('2026-04-01'), isAvailable: true },
        { date: new Date('2026-04-02'), isAvailable: false },
      ];
      prisma.availabilitySlot.findMany.mockResolvedValue(mockSlots);

      const result = await service.getMonthAvailability('caravan-1', 4, 2026);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('queries correct date range for the month', async () => {
      prisma.availabilitySlot.findMany.mockResolvedValue([]);
      await service.getMonthAvailability('caravan-1', 4, 2026);

      const call = prisma.availabilitySlot.findMany.mock.calls[0][0];
      const startDate = call.where.date.gte;
      const endDate = call.where.date.lte;

      expect(startDate.getMonth()).toBe(3); // April (0-indexed)
      expect(startDate.getDate()).toBe(1);
      expect(endDate.getMonth()).toBe(3); // April
      expect(endDate.getDate()).toBe(30); // Last day of April
    });
  });
});
