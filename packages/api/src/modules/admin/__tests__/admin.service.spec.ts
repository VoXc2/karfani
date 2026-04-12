import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { createMockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: ReturnType<typeof createMockPrismaService>;
  let events: ReturnType<typeof createMockEventEmitter>;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new AdminService(prisma as any, events as any);
  });

  describe('listUsers', () => {
    it('returns paginated users without search', async () => {
      const users = [
        { id: 'u1', fullNameAr: 'محمد', fullNameEn: 'Mohammed' },
        { id: 'u2', fullNameAr: 'أحمد', fullNameEn: 'Ahmed' },
      ];
      prisma.user.findMany.mockResolvedValue(users);
      prisma.user.count.mockResolvedValue(2);

      const result = await service.listUsers({});

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('applies search filter across multiple fields', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.listUsers({ search: 'محمد' });

      const findCall = prisma.user.findMany.mock.calls[0][0];
      expect(findCall.where.OR).toBeDefined();
      expect(findCall.where.OR).toHaveLength(4);
      expect(findCall.where.OR[0]).toEqual({ fullNameAr: { contains: 'محمد', mode: 'insensitive' } });
      expect(findCall.where.OR[1]).toEqual({ fullNameEn: { contains: 'محمد', mode: 'insensitive' } });
      expect(findCall.where.OR[2]).toEqual({ email: { contains: 'محمد', mode: 'insensitive' } });
      expect(findCall.where.OR[3]).toEqual({ phone: { contains: 'محمد' } });
    });

    it('does not set OR when search is not provided', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.listUsers({});

      const findCall = prisma.user.findMany.mock.calls[0][0];
      expect(findCall.where.OR).toBeUndefined();
    });

    it('calculates totalPages correctly', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(55);

      const result = await service.listUsers({ page: 3, limit: 10 });

      expect(result.pagination.totalPages).toBe(6);
      expect(result.pagination.page).toBe(3);
    });
  });

  describe('getUser', () => {
    it('returns user with related counts', async () => {
      const user = {
        id: 'u1',
        fullNameAr: 'محمد',
        drivingLicense: { id: 'dl-1' },
        ownerProfile: null,
        _count: { bookings: 5, supportTickets: 2, reviews: 3 },
      };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getUser('u1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(user);
      expect(result.data._count.bookings).toBe(5);
      expect(result.data._count.supportTickets).toBe(2);
      expect(result.data._count.reviews).toBe(3);
    });

    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUser('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserStatus', () => {
    it('activates a user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', isActive: false });
      prisma.user.update.mockResolvedValue({ id: 'u1', isActive: true });

      const result = await service.updateUserStatus('u1', { isActive: true });

      expect(result.success).toBe(true);
      expect(result.data.isActive).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { isActive: true },
      });
    });

    it('deactivates a user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', isActive: true });
      prisma.user.update.mockResolvedValue({ id: 'u1', isActive: false });

      const result = await service.updateUserStatus('u1', { isActive: false });

      expect(result.success).toBe(true);
      expect(result.data.isActive).toBe(false);
    });

    it('emits admin.userStatusChanged event', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', isActive: true });
      prisma.user.update.mockResolvedValue({ id: 'u1', isActive: false });

      await service.updateUserStatus('u1', { isActive: false });

      expect(events.emit).toHaveBeenCalledWith('admin.userStatusChanged', {
        userId: 'u1',
        isActive: false,
      });
    });

    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserStatus('nonexistent', { isActive: true }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPendingCaravans', () => {
    it('returns paginated pending caravans', async () => {
      const caravans = [
        { id: 'c1', status: 'PENDING_REVIEW', owner: { user: { fullNameAr: 'محمد', phone: '+966500000000' } }, media: [{ url: 'https://example.com/photo.jpg' }] },
        { id: 'c2', status: 'PENDING_REVIEW', owner: { user: { fullNameAr: 'أحمد', phone: '+966500000001' } }, media: [] },
      ];
      prisma.caravan.findMany.mockResolvedValue(caravans);
      prisma.caravan.count.mockResolvedValue(2);

      const result = await service.getPendingCaravans({});

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('uses default pagination values', async () => {
      prisma.caravan.findMany.mockResolvedValue([]);
      prisma.caravan.count.mockResolvedValue(0);

      const result = await service.getPendingCaravans({});

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('filters only PENDING_REVIEW caravans', async () => {
      prisma.caravan.findMany.mockResolvedValue([]);
      prisma.caravan.count.mockResolvedValue(0);

      await service.getPendingCaravans({});

      const findCall = prisma.caravan.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('PENDING_REVIEW');
    });

    it('calculates totalPages for pending caravans', async () => {
      prisma.caravan.findMany.mockResolvedValue([]);
      prisma.caravan.count.mockResolvedValue(35);

      const result = await service.getPendingCaravans({ page: 1, limit: 10 });

      expect(result.pagination.totalPages).toBe(4);
    });
  });

  describe('approveCaravan', () => {
    it('approves a PENDING_REVIEW caravan by setting status to ACTIVE', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'PENDING_REVIEW' });
      const updatedCaravan = { id: 'c1', status: 'ACTIVE' };
      prisma.caravan.update.mockResolvedValue(updatedCaravan);

      const result = await service.approveCaravan('c1');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('ACTIVE');
      expect(prisma.caravan.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { status: 'ACTIVE' },
      });
    });

    it('emits admin.caravanApproved event', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'PENDING_REVIEW' });
      const updatedCaravan = { id: 'c1', status: 'ACTIVE' };
      prisma.caravan.update.mockResolvedValue(updatedCaravan);

      await service.approveCaravan('c1');

      expect(events.emit).toHaveBeenCalledWith('admin.caravanApproved', updatedCaravan);
    });

    it('throws NotFoundException when caravan does not exist', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);

      await expect(service.approveCaravan('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when caravan is ACTIVE', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'ACTIVE' });

      await expect(service.approveCaravan('c1')).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when caravan is SUSPENDED', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'SUSPENDED' });

      await expect(service.approveCaravan('c1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('rejectCaravan', () => {
    it('rejects a PENDING_REVIEW caravan by setting status to SUSPENDED', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'PENDING_REVIEW' });
      const updatedCaravan = { id: 'c1', status: 'SUSPENDED' };
      prisma.caravan.update.mockResolvedValue(updatedCaravan);

      const result = await service.rejectCaravan('c1', { reason: 'Missing documents' });

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('SUSPENDED');
      expect(prisma.caravan.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { status: 'SUSPENDED' },
      });
    });

    it('emits admin.caravanRejected event with reason', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'PENDING_REVIEW' });
      const updatedCaravan = { id: 'c1', status: 'SUSPENDED' };
      prisma.caravan.update.mockResolvedValue(updatedCaravan);

      await service.rejectCaravan('c1', { reason: 'Poor condition' });

      expect(events.emit).toHaveBeenCalledWith('admin.caravanRejected', {
        caravan: updatedCaravan,
        reason: 'Poor condition',
      });
    });

    it('throws NotFoundException when caravan does not exist', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);

      await expect(service.rejectCaravan('nonexistent', {})).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when caravan is not PENDING_REVIEW', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'SUSPENDED' });

      await expect(service.rejectCaravan('c1', { reason: 'Bad' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when caravan is ACTIVE', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'c1', status: 'ACTIVE' });

      await expect(service.rejectCaravan('c1', { reason: 'Not allowed' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getDashboard', () => {
    it('returns aggregate dashboard data', async () => {
      prisma.user.count.mockResolvedValue(100);
      prisma.caravan.count.mockResolvedValueOnce(50).mockResolvedValueOnce(5);
      prisma.booking.count.mockResolvedValue(200);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 150000 } });

      const result = await service.getDashboard();

      expect(result.success).toBe(true);
      expect(result.data.totalUsers).toBe(100);
      expect(result.data.totalCaravans).toBe(50);
      expect(result.data.pendingCaravans).toBe(5);
      expect(result.data.totalBookings).toBe(200);
      expect(result.data.totalRevenue).toBe(150000);
    });

    it('returns 0 revenue when no payments exist', async () => {
      prisma.user.count.mockResolvedValue(0);
      prisma.caravan.count.mockResolvedValue(0);
      prisma.booking.count.mockResolvedValue(0);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: null } });

      const result = await service.getDashboard();

      expect(result.data.totalRevenue).toBe(0);
    });

    it('aggregates payments filtered by COMPLETED status and BOOKING_PAYMENT type', async () => {
      prisma.user.count.mockResolvedValue(10);
      prisma.caravan.count.mockResolvedValue(5);
      prisma.booking.count.mockResolvedValue(20);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 50000 } });

      await service.getDashboard();

      expect(prisma.payment.aggregate).toHaveBeenCalledWith({
        where: { status: 'COMPLETED', type: 'BOOKING_PAYMENT' },
        _sum: { amount: true },
      });
    });
  });
});
