import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';
import { DamageService } from '../damage.service';

describe('DamageService', () => {
  let service: DamageService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new DamageService(prisma as any, events as any);
  });

  describe('create', () => {
    const reportedById = 'user-1';
    const damageData = {
      bookingId: 'booking-1',
      inspectionId: 'inspection-1',
      severity: 'MODERATE',
      description: 'Scratch on the left side panel',
      photos: [
        { url: 'https://storage.example.com/damage1.jpg', description: 'Left panel scratch' },
        { url: 'https://storage.example.com/damage2.jpg', description: 'Close-up of scratch' },
      ],
    };

    beforeEach(() => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'booking-1', caravanId: 'caravan-1' });
      prisma.damageReport.create.mockResolvedValue({
        id: 'damage-1',
        bookingId: 'booking-1',
        inspectionId: 'inspection-1',
        reportedById,
        severity: 'MODERATE',
        description: 'Scratch on the left side panel',
        status: 'REPORTED',
        photos: [
          { id: 'dp-1', url: 'https://storage.example.com/damage1.jpg', description: 'Left panel scratch' },
          { id: 'dp-2', url: 'https://storage.example.com/damage2.jpg', description: 'Close-up of scratch' },
        ],
        reportedBy: { fullNameAr: 'محمد أحمد', phone: '+966500000000' },
      });
    });

    it('creates a damage report with photos successfully', async () => {
      const result = await service.create(reportedById, damageData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.photos).toHaveLength(2);
      expect(prisma.damageReport.create).toHaveBeenCalledOnce();
    });

    it('passes photos as nested create to Prisma', async () => {
      await service.create(reportedById, damageData);

      const createCall = prisma.damageReport.create.mock.calls[0][0];
      expect(createCall.data.photos.create).toHaveLength(2);
      expect(createCall.data.photos.create[0]).toEqual({
        url: 'https://storage.example.com/damage1.jpg',
        description: 'Left panel scratch',
      });
    });

    it('emits damage.reported event with caravanId', async () => {
      await service.create(reportedById, damageData);
      expect(events.emit).toHaveBeenCalledWith('damage.reported', {
        report: expect.any(Object),
        caravanId: 'caravan-1',
      });
    });

    it('throws NotFoundException when booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.create(reportedById, damageData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('returns damage report with all relations', async () => {
      const mockReport = {
        id: 'damage-1',
        status: 'REPORTED',
        severity: 'MODERATE',
        photos: [{ id: 'dp-1', url: 'photo.jpg' }],
        reportedBy: { fullNameAr: 'محمد أحمد', phone: '+966500000000' },
        booking: { id: 'booking-1', bookingNumber: 'KRF-001', caravanId: 'caravan-1' },
        inspection: { id: 'inspection-1', type: 'POST_RENTAL' },
      };
      prisma.damageReport.findUnique.mockResolvedValue(mockReport);

      const result = await service.findOne('damage-1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockReport);
    });

    it('throws NotFoundException when damage report does not exist', async () => {
      prisma.damageReport.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assess', () => {
    const assessData = {
      status: 'ASSESSED',
      estimatedCost: 500,
      actualCost: 450,
      depositDeduction: 450,
    };

    it('allows valid transition REPORTED -> ASSESSING', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'REPORTED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'ASSESSING' });

      const result = await service.assess('damage-1', { ...assessData, status: 'ASSESSING' });
      expect(result.success).toBe(true);
      expect(prisma.damageReport.update).toHaveBeenCalledOnce();
    });

    it('allows valid transition ASSESSING -> ASSESSED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'ASSESSING' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'ASSESSED' });

      const result = await service.assess('damage-1', { ...assessData, status: 'ASSESSED' });
      expect(result.success).toBe(true);
    });

    it('allows valid transition ASSESSED -> RESOLVED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'ASSESSED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'RESOLVED', resolvedAt: new Date() });

      const result = await service.assess('damage-1', { ...assessData, status: 'RESOLVED' });
      expect(result.success).toBe(true);
    });

    it('allows valid transition ASSESSED -> DISPUTED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'ASSESSED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'DISPUTED' });

      const result = await service.assess('damage-1', { ...assessData, status: 'DISPUTED' });
      expect(result.success).toBe(true);
    });

    it('allows valid transition ASSESSED -> CUSTOMER_RESPONSE', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'ASSESSED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'CUSTOMER_RESPONSE' });

      const result = await service.assess('damage-1', {
        status: 'CUSTOMER_RESPONSE',
        customerResponse: 'I disagree with the assessment',
      });
      expect(result.success).toBe(true);
    });

    it('allows valid transition DISPUTED -> ASSESSING', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'DISPUTED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'ASSESSING' });

      const result = await service.assess('damage-1', { status: 'ASSESSING' });
      expect(result.success).toBe(true);
    });

    it('allows valid transition CUSTOMER_RESPONSE -> ASSESSED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'CUSTOMER_RESPONSE' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'ASSESSED' });

      const result = await service.assess('damage-1', { ...assessData, status: 'ASSESSED' });
      expect(result.success).toBe(true);
    });

    it('sets resolvedAt when transitioning to RESOLVED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'ASSESSED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'RESOLVED' });

      await service.assess('damage-1', { ...assessData, status: 'RESOLVED' });

      const updateCall = prisma.damageReport.update.mock.calls[0][0];
      expect(updateCall.data.resolvedAt).toBeInstanceOf(Date);
    });

    it('does not set resolvedAt for non-RESOLVED transitions', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'REPORTED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'ASSESSING' });

      await service.assess('damage-1', { status: 'ASSESSING' });

      const updateCall = prisma.damageReport.update.mock.calls[0][0];
      expect(updateCall.data.resolvedAt).toBeUndefined();
    });

    it('emits damage.assessed event', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'REPORTED' });
      prisma.damageReport.update.mockResolvedValue({ id: 'damage-1', status: 'ASSESSING' });

      await service.assess('damage-1', { status: 'ASSESSING' });
      expect(events.emit).toHaveBeenCalledWith('damage.assessed', expect.any(Object));
    });

    it('throws BadRequestException for invalid transition REPORTED -> ASSESSED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'REPORTED' });
      await expect(service.assess('damage-1', { status: 'ASSESSED' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid transition REPORTED -> RESOLVED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'REPORTED' });
      await expect(service.assess('damage-1', { status: 'RESOLVED' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid transition ASSESSING -> DISPUTED', async () => {
      prisma.damageReport.findUnique.mockResolvedValue({ id: 'damage-1', status: 'ASSESSING' });
      await expect(service.assess('damage-1', { status: 'DISPUTED' })).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when damage report does not exist', async () => {
      prisma.damageReport.findUnique.mockResolvedValue(null);
      await expect(service.assess('nonexistent', assessData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBooking', () => {
    it('returns damage reports for a booking', async () => {
      const mockReports = [
        { id: 'damage-2', severity: 'MINOR', photos: [], reportedBy: { fullNameAr: 'أحمد', phone: '+966500000000' } },
        { id: 'damage-1', severity: 'MODERATE', photos: [], reportedBy: { fullNameAr: 'محمد', phone: '+966511111111' } },
      ];
      prisma.damageReport.findMany.mockResolvedValue(mockReports);

      const result = await service.findByBooking('booking-1');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(prisma.damageReport.findMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking-1' },
        include: {
          photos: true,
          reportedBy: { select: { fullNameAr: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findByCaravan', () => {
    it('returns damage reports for a caravan', async () => {
      const mockReports = [
        {
          id: 'damage-1',
          photos: [],
          reportedBy: { fullNameAr: 'محمد', phone: '+966500000000' },
          booking: { id: 'booking-1', bookingNumber: 'KRF-001' },
        },
      ];
      prisma.damageReport.findMany.mockResolvedValue(mockReports);

      const result = await service.findByCaravan('caravan-1');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(prisma.damageReport.findMany).toHaveBeenCalledWith({
        where: { booking: { caravanId: 'caravan-1' } },
        include: {
          photos: true,
          reportedBy: { select: { fullNameAr: true, phone: true } },
          booking: { select: { id: true, bookingNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
