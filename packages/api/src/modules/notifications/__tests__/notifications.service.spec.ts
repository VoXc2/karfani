import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationsService } from '../notifications.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: MockPrismaService;
  let mockConfig: any;
  let mockQueue: any;

  beforeEach(() => {
    prisma = createMockPrismaService();
    mockConfig = {
      get: vi.fn((key: string) => {
        if (key === 'UNIFONIC_APP_SID') return '';
        if (key === 'NODE_ENV') return 'test';
        return null;
      }),
    };
    mockQueue = {
      add: vi.fn().mockResolvedValue(undefined),
    };
    service = new NotificationsService(prisma as any, mockConfig, mockQueue);
  });

  describe('handleBookingCreated', () => {
    it('creates in-app notification', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'n1' });

      await service.handleBookingCreated({
        bookingNumber: 'KRF-123',
        customerId: 'user-1',
        customer: { phone: '+966500000000' },
      });

      expect(prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            title: 'تم إنشاء حجزك',
          }),
        }),
      );
    });
  });

  describe('handlePaymentCompleted', () => {
    it('creates notification for payment', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'n1' });

      await service.handlePaymentCompleted({
        booking: { bookingNumber: 'KRF-456', customerId: 'user-2' },
      });

      expect(prisma.notification.create).toHaveBeenCalledOnce();
    });
  });

  describe('sendSms', () => {
    it('queues SMS in dev mode', async () => {
      await service.sendSms('+966500000000', 'test message');
      expect(mockQueue.add).toHaveBeenCalledWith('sms', {
        phone: '+966500000000',
        message: 'test message',
      });
    });
  });

  describe('sendEmail', () => {
    it('queues email', async () => {
      await service.sendEmail('test@test.com', 'Subject', 'Body');
      expect(mockQueue.add).toHaveBeenCalledWith('email', {
        to: 'test@test.com',
        subject: 'Subject',
        body: 'Body',
      });
    });
  });

  describe('getByUser', () => {
    it('returns user notifications', async () => {
      prisma.notification.findMany.mockResolvedValue([
        { id: 'n1', title: 'Test' },
        { id: 'n2', title: 'Test 2' },
      ]);

      const result = await service.getByUser('user-1');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('markRead', () => {
    it('marks notification as read', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markRead('n1', 'user-1');
      expect(result.success).toBe(true);
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { id: 'n1', userId: 'user-1' },
        data: { readAt: expect.any(Date) },
      });
    });
  });

  describe('markAllRead', () => {
    it('marks all notifications as read', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllRead('user-1');
      expect(result.success).toBe(true);
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', readAt: null },
        data: { readAt: expect.any(Date) },
      });
    });
  });
});
