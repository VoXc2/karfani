import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { PaymentsService } from '../payments.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;
  let mockConfig: any;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'MOYASAR_API_KEY') return '';
        if (key === 'MOYASAR_WEBHOOK_SECRET') return '';
        if (key === 'NODE_ENV') return 'test';
        if (key === 'WEB_URL') return 'http://localhost:3000';
        return null;
      }),
    };
    service = new PaymentsService(prisma as any, events as any, mockConfig);
  });

  describe('initiatePayment', () => {
    const bookingId = 'booking-123';

    beforeEach(() => {
      prisma.booking.findUniqueOrThrow.mockResolvedValue({
        id: bookingId,
        status: 'PENDING_PAYMENT',
        totalPrice: 690,
        securityDeposit: 1000,
      });
      prisma.payment.create.mockResolvedValue({ id: 'pay-1', status: 'PROCESSING' });
      prisma.payment.update.mockResolvedValue({ id: 'pay-1', status: 'COMPLETED' });
      prisma.booking.update.mockResolvedValue({ id: bookingId, status: 'CONFIRMED' });
    });

    it('creates payment and confirms booking for PENDING_PAYMENT status', async () => {
      const result = await service.initiatePayment(bookingId, 'mada');
      expect(result.success).toBe(true);
      expect(prisma.payment.create).toHaveBeenCalled();
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    });

    it('throws BadRequestException when booking is not PENDING_PAYMENT', async () => {
      prisma.booking.findUniqueOrThrow.mockResolvedValue({
        id: bookingId,
        status: 'CONFIRMED',
        totalPrice: 690,
        securityDeposit: 1000,
      });
      await expect(service.initiatePayment(bookingId, 'mada')).rejects.toThrow(BadRequestException);
    });

    it('creates security deposit record', async () => {
      await service.initiatePayment(bookingId, 'mada');
      const depositCall = prisma.payment.create.mock.calls[1];
      expect(depositCall[0].data.type).toBe('SECURITY_DEPOSIT');
      expect(depositCall[0].data.amount).toBe(1000);
    });

    it('emits payment.completed event', async () => {
      await service.initiatePayment(bookingId, 'mada');
      expect(events.emit).toHaveBeenCalledWith('payment.completed', expect.objectContaining({
        payment: expect.any(Object),
        booking: expect.any(Object),
      }));
    });

    it('records the payment method', async () => {
      await service.initiatePayment(bookingId, 'apple_pay');
      const createCall = prisma.payment.create.mock.calls[0][0];
      expect(createCall.data.method).toBe('apple_pay');
    });
  });

  describe('getByBooking', () => {
    it('returns payments ordered by date desc', async () => {
      const payments = [
        { id: 'p1', createdAt: new Date('2026-04-02') },
        { id: 'p2', createdAt: new Date('2026-04-01') },
      ];
      prisma.payment.findMany.mockResolvedValue(payments);

      const result = await service.getByBooking('booking-123');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking-123' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('returns empty array for booking with no payments', async () => {
      prisma.payment.findMany.mockResolvedValue([]);
      const result = await service.getByBooking('booking-123');
      expect(result.data).toEqual([]);
    });
  });
});
