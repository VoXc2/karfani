import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DispatchService } from '../dispatch.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

describe('DispatchService', () => {
  let service: DispatchService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new DispatchService(prisma as any, events as any);
  });

  describe('assign', () => {
    it('assigns dispatcher to CONFIRMED booking', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'PREPARING' });

      const result = await service.assign('dispatcher-1', { bookingId: 'b1' });
      expect(result.success).toBe(true);
      expect(events.emit).toHaveBeenCalledWith('dispatch.assigned', expect.any(Object));
    });

    it('assigns dispatcher to PREPARING booking', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PREPARING' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'PREPARING' });

      const result = await service.assign('dispatcher-1', { bookingId: 'b1' });
      expect(result.success).toBe(true);
    });

    it('throws when booking not found', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.assign('d1', { bookingId: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('throws when booking is in wrong status', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'ACTIVE' });
      await expect(service.assign('d1', { bookingId: 'b1' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getActive', () => {
    it('returns active dispatch bookings', async () => {
      prisma.booking.findMany.mockResolvedValue([{ id: 'b1', status: 'PREPARING' }]);
      const result = await service.getActive();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('markPickedUp', () => {
    it('marks PREPARING booking as DISPATCHED', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PREPARING' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'DISPATCHED' });

      const result = await service.markPickedUp('b1');
      expect(result.success).toBe(true);
      expect(events.emit).toHaveBeenCalledWith('dispatch.pickedUp', expect.any(Object));
    });

    it('throws when not PREPARING', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });
      await expect(service.markPickedUp('b1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('markDelivered', () => {
    it('marks DISPATCHED booking as HANDED_OVER', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'DISPATCHED' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'HANDED_OVER' });

      const result = await service.markDelivered('b1');
      expect(result.success).toBe(true);
      expect(events.emit).toHaveBeenCalledWith('dispatch.delivered', expect.any(Object));
    });

    it('throws when not DISPATCHED', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'PREPARING' });
      await expect(service.markDelivered('b1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('markReturned', () => {
    it('marks RETURN_PENDING booking as RETURNED', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'RETURN_PENDING' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'RETURNED' });

      const result = await service.markReturned('b1');
      expect(result.success).toBe(true);
      expect(events.emit).toHaveBeenCalledWith('dispatch.returned', expect.any(Object));
    });

    it('marks ACTIVE booking as RETURNED', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'ACTIVE' });
      prisma.booking.update.mockResolvedValue({ id: 'b1', status: 'RETURNED' });

      const result = await service.markReturned('b1');
      expect(result.success).toBe(true);
    });

    it('throws when in wrong status', async () => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'b1', status: 'CONFIRMED' });
      await expect(service.markReturned('b1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getHistory', () => {
    it('returns paginated history', async () => {
      prisma.booking.findMany.mockResolvedValue([{ id: 'b1' }, { id: 'b2' }]);
      prisma.booking.count.mockResolvedValue(2);

      const result = await service.getHistory({});
      expect(result.success).toBe(true);
      expect(result.pagination.total).toBe(2);
    });
  });
});
