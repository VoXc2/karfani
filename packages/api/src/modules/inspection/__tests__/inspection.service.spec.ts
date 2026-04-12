import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';
import { InspectionService } from '../inspection.service';

describe('InspectionService', () => {
  let service: InspectionService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new InspectionService(prisma as any, events as any);
  });

  describe('create', () => {
    const inspectorId = 'inspector-1';
    const inspectionData = {
      bookingId: 'booking-1',
      type: 'PRE_RENTAL',
      odometerKm: 45000,
      fuelLevel: 'FULL',
      checklist: ['tires_ok', 'lights_ok', 'interior_clean'],
      notes: 'All good',
      photos: [
        { url: 'https://storage.example.com/photo1.jpg', category: 'EXTERIOR', notes: 'Front view' },
        { url: 'https://storage.example.com/photo2.jpg', category: 'INTERIOR', notes: 'Dashboard' },
      ],
    };

    beforeEach(() => {
      prisma.booking.findUnique.mockResolvedValue({ id: 'booking-1' });
      prisma.inspection.create.mockResolvedValue({
        id: 'inspection-1',
        bookingId: 'booking-1',
        inspectorId,
        type: 'PRE_RENTAL',
        odometerKm: 45000,
        fuelLevel: 'FULL',
        photos: [
          { id: 'photo-1', url: 'https://storage.example.com/photo1.jpg', category: 'EXTERIOR', notes: 'Front view' },
          { id: 'photo-2', url: 'https://storage.example.com/photo2.jpg', category: 'INTERIOR', notes: 'Dashboard' },
        ],
        inspector: { fullNameAr: 'فهد العتيبي', phone: '+966511111111' },
      });
    });

    it('creates an inspection with photos successfully', async () => {
      const result = await service.create(inspectorId, inspectionData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.photos).toHaveLength(2);
      expect(prisma.inspection.create).toHaveBeenCalledOnce();
    });

    it('passes photos as nested create to Prisma', async () => {
      await service.create(inspectorId, inspectionData);

      const createCall = prisma.inspection.create.mock.calls[0][0];
      expect(createCall.data.photos.create).toHaveLength(2);
      expect(createCall.data.photos.create[0]).toEqual({
        url: 'https://storage.example.com/photo1.jpg',
        category: 'EXTERIOR',
        notes: 'Front view',
      });
    });

    it('creates inspection with correct inspector and booking references', async () => {
      await service.create(inspectorId, inspectionData);

      const createCall = prisma.inspection.create.mock.calls[0][0];
      expect(createCall.data.inspectorId).toBe(inspectorId);
      expect(createCall.data.bookingId).toBe('booking-1');
      expect(createCall.data.type).toBe('PRE_RENTAL');
    });

    it('emits inspection.created event', async () => {
      await service.create(inspectorId, inspectionData);
      expect(events.emit).toHaveBeenCalledWith('inspection.created', expect.any(Object));
    });

    it('throws NotFoundException when booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.create(inspectorId, inspectionData)).rejects.toThrow(NotFoundException);
    });

    it('creates inspection with empty photos when none provided', async () => {
      const dataWithoutPhotos = { ...inspectionData, photos: undefined };
      prisma.inspection.create.mockResolvedValue({
        id: 'inspection-1',
        photos: [],
        inspector: { fullNameAr: 'فهد العتيبي', phone: '+966511111111' },
      });

      await service.create(inspectorId, dataWithoutPhotos);

      const createCall = prisma.inspection.create.mock.calls[0][0];
      expect(createCall.data.photos.create).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('returns inspection with all relations', async () => {
      const mockInspection = {
        id: 'inspection-1',
        bookingId: 'booking-1',
        type: 'PRE_RENTAL',
        photos: [{ id: 'p1', url: 'photo.jpg' }],
        inspector: { fullNameAr: 'فهد العتيبي', phone: '+966511111111' },
        booking: { id: 'booking-1', bookingNumber: 'KRF-001', caravanId: 'caravan-1', status: 'ACTIVE' },
        damageReports: [],
      };
      prisma.inspection.findUnique.mockResolvedValue(mockInspection);

      const result = await service.findOne('inspection-1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockInspection);
      expect(result.data.photos).toHaveLength(1);
    });

    it('throws NotFoundException when inspection does not exist', async () => {
      prisma.inspection.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('complete', () => {
    const completionData = {
      cleanlinessScore: 8,
      overallScore: 9,
      notes: 'Minor wear on tires',
    };

    it('completes an inspection successfully', async () => {
      prisma.inspection.findUnique.mockResolvedValue({
        id: 'inspection-1',
        completedAt: null,
        notes: 'Original notes',
      });
      const updatedInspection = {
        id: 'inspection-1',
        cleanlinessScore: 8,
        overallScore: 9,
        completedAt: new Date(),
        notes: 'Minor wear on tires',
      };
      prisma.inspection.update.mockResolvedValue(updatedInspection);

      const result = await service.complete('inspection-1', completionData);
      expect(result.success).toBe(true);
      expect(prisma.inspection.update).toHaveBeenCalledWith({
        where: { id: 'inspection-1' },
        data: {
          cleanlinessScore: 8,
          overallScore: 9,
          notes: 'Minor wear on tires',
          completedAt: expect.any(Date),
        },
        include: { photos: true, booking: true },
      });
    });

    it('emits inspection.completed event', async () => {
      prisma.inspection.findUnique.mockResolvedValue({
        id: 'inspection-1',
        completedAt: null,
        notes: 'Original notes',
      });
      prisma.inspection.update.mockResolvedValue({ id: 'inspection-1', completedAt: new Date() });

      await service.complete('inspection-1', completionData);
      expect(events.emit).toHaveBeenCalledWith('inspection.completed', expect.any(Object));
    });

    it('throws BadRequestException when inspection is already completed', async () => {
      prisma.inspection.findUnique.mockResolvedValue({
        id: 'inspection-1',
        completedAt: new Date('2026-04-01'),
      });

      await expect(service.complete('inspection-1', completionData)).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when inspection does not exist', async () => {
      prisma.inspection.findUnique.mockResolvedValue(null);
      await expect(service.complete('nonexistent', completionData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByBooking', () => {
    it('returns inspections for a booking ordered by createdAt desc', async () => {
      const mockInspections = [
        { id: 'inspection-2', type: 'POST_RENTAL', photos: [], inspector: { fullNameAr: 'فهد', phone: '+966511111111' } },
        { id: 'inspection-1', type: 'PRE_RENTAL', photos: [], inspector: { fullNameAr: 'فهد', phone: '+966511111111' } },
      ];
      prisma.inspection.findMany.mockResolvedValue(mockInspections);

      const result = await service.findByBooking('booking-1');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(prisma.inspection.findMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking-1' },
        include: {
          photos: true,
          inspector: { select: { fullNameAr: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
