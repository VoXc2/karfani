import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MaintenanceService } from '../maintenance.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new MaintenanceService(prisma as any, events as any);
  });

  describe('create', () => {
    const data = {
      caravanId: 'caravan-1',
      type: 'PREVENTIVE',
      priority: 'HIGH',
      description: 'فحص دوري',
      vendorName: 'ورشة الأمان',
      estimatedCost: 500,
    };

    it('creates maintenance job successfully', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'caravan-1' });
      prisma.maintenanceJob.create.mockResolvedValue({ id: 'job-1', ...data, status: 'SCHEDULED' });

      const result = await service.create(data);
      expect(result.success).toBe(true);
      expect(result.data.id).toBe('job-1');
      expect(prisma.maintenanceJob.create).toHaveBeenCalledOnce();
    });

    it('throws when caravan not found', async () => {
      prisma.caravan.findUnique.mockResolvedValue(null);
      await expect(service.create(data)).rejects.toThrow(NotFoundException);
    });

    it('emits maintenance.scheduled event', async () => {
      prisma.caravan.findUnique.mockResolvedValue({ id: 'caravan-1' });
      prisma.maintenanceJob.create.mockResolvedValue({ id: 'job-1', status: 'SCHEDULED' });

      await service.create(data);
      expect(events.emit).toHaveBeenCalledWith('maintenance.scheduled', expect.any(Object));
    });
  });

  describe('findAll', () => {
    it('returns paginated jobs', async () => {
      prisma.maintenanceJob.findMany.mockResolvedValue([{ id: 'j1' }, { id: 'j2' }]);
      prisma.maintenanceJob.count.mockResolvedValue(2);

      const result = await service.findAll({});
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('filters by status', async () => {
      prisma.maintenanceJob.findMany.mockResolvedValue([]);
      prisma.maintenanceJob.count.mockResolvedValue(0);

      await service.findAll({ status: 'IN_PROGRESS' });
      const call = prisma.maintenanceJob.findMany.mock.calls[0][0];
      expect(call.where.status).toBe('IN_PROGRESS');
    });
  });

  describe('findOne', () => {
    it('returns job when found', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue({ id: 'j1', status: 'SCHEDULED' });
      const result = await service.findOne('j1');
      expect(result.success).toBe(true);
    });

    it('throws when not found', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('start', () => {
    it('starts a SCHEDULED job', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue({ id: 'j1', status: 'SCHEDULED', caravanId: 'c1' });
      prisma.$transaction.mockResolvedValue([{ id: 'j1', status: 'IN_PROGRESS' }, {}]);

      const result = await service.start('j1');
      expect(result.success).toBe(true);
    });

    it('throws when job not SCHEDULED', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue({ id: 'j1', status: 'COMPLETED' });
      await expect(service.start('j1')).rejects.toThrow(BadRequestException);
    });

    it('throws when not found', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue(null);
      await expect(service.start('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('complete', () => {
    it('completes an IN_PROGRESS job', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue({ id: 'j1', status: 'IN_PROGRESS', caravanId: 'c1', description: 'test' });
      prisma.$transaction.mockResolvedValue([{ id: 'j1', status: 'COMPLETED' }, {}]);

      const result = await service.complete('j1', { actualCost: 450 });
      expect(result.success).toBe(true);
    });

    it('throws when job not IN_PROGRESS', async () => {
      prisma.maintenanceJob.findUnique.mockResolvedValue({ id: 'j1', status: 'SCHEDULED' });
      await expect(service.complete('j1', {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByCaravan', () => {
    it('returns jobs for caravan', async () => {
      prisma.maintenanceJob.findMany.mockResolvedValue([{ id: 'j1' }]);
      const result = await service.findByCaravan('c1');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });
});
