import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';
import { createMockEventEmitter, type MockEventEmitter } from '../../../../test/helpers/event-emitter-mock';
import { ContractsService } from '../contracts.service';

describe('ContractsService', () => {
  let service: ContractsService;
  let prisma: MockPrismaService;
  let events: MockEventEmitter;

  beforeEach(() => {
    prisma = createMockPrismaService();
    events = createMockEventEmitter();
    service = new ContractsService(prisma as any, events as any);
  });

  describe('generate', () => {
    const userId = 'user-1';
    const bookingId = 'booking-1';

    const mockBooking = {
      id: bookingId,
      bookingNumber: 'KRF-001',
      customer: { fullNameAr: 'محمد أحمد', phone: '+966500000000' },
      caravan: { titleAr: 'كرفان فاخر', plateNumber: 'ABC-1234' },
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-04-20'),
      totalDays: 5,
      totalPrice: 2500,
      securityDeposit: 1000,
    };

    beforeEach(() => {
      prisma.booking.findUnique.mockResolvedValue(mockBooking);
      prisma.contract.findUnique.mockResolvedValue(null);
      prisma.contract.create.mockResolvedValue({
        id: 'contract-1',
        bookingId,
        templateVersion: '1.0.0',
        status: 'DRAFT',
        contentJson: {},
      });
    });

    it('generates a contract successfully', async () => {
      const result = await service.generate(userId, { bookingId });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: {
          customer: { select: { fullNameAr: true, phone: true } },
          caravan: { select: { titleAr: true, plateNumber: true } },
        },
      });
      expect(prisma.contract.create).toHaveBeenCalledOnce();
    });

    it('creates contract with correct data from booking', async () => {
      await service.generate(userId, { bookingId });

      const createCall = prisma.contract.create.mock.calls[0][0];
      expect(createCall.data.bookingId).toBe(bookingId);
      expect(createCall.data.templateVersion).toBe('1.0.0');
      expect(createCall.data.status).toBe('DRAFT');
      expect(createCall.data.contentJson).toBeDefined();
      expect(createCall.data.expiresAt).toBeInstanceOf(Date);
    });

    it('emits contract.generated event', async () => {
      await service.generate(userId, { bookingId });
      expect(events.emit).toHaveBeenCalledWith('contract.generated', expect.any(Object));
    });

    it('throws NotFoundException when booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.generate(userId, { bookingId })).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when contract already exists', async () => {
      prisma.contract.findUnique.mockResolvedValue({ id: 'existing-contract' });
      await expect(service.generate(userId, { bookingId })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('returns contract with booking relations', async () => {
      const mockContract = {
        id: 'contract-1',
        bookingId: 'booking-1',
        status: 'DRAFT',
        booking: {
          bookingNumber: 'KRF-001',
          status: 'CONFIRMED',
          customer: { fullNameAr: 'محمد أحمد', phone: '+966500000000' },
          caravan: { titleAr: 'كرفان فاخر', plateNumber: 'ABC-1234' },
        },
      };
      prisma.contract.findUnique.mockResolvedValue(mockContract);

      const result = await service.findOne('contract-1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockContract);
    });

    it('throws NotFoundException when contract does not exist', async () => {
      prisma.contract.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('sign', () => {
    const contractId = 'contract-1';
    const customerId = 'customer-1';
    const operatorId = 'operator-1';

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    it('signs as customer when userId matches customerId', async () => {
      prisma.contract.findUnique.mockResolvedValue({
        id: contractId,
        status: 'DRAFT',
        expiresAt: futureDate,
        customerSignedAt: null,
        operatorSignedAt: null,
        booking: { customerId },
      });
      const updatedContract = {
        id: contractId,
        status: 'CUSTOMER_SIGNED',
        customerSignedAt: expect.any(Date),
      };
      prisma.contract.update.mockResolvedValue(updatedContract);

      const result = await service.sign(contractId, customerId);
      expect(result.success).toBe(true);

      const updateCall = prisma.contract.update.mock.calls[0][0];
      expect(updateCall.data.customerSignedAt).toBeInstanceOf(Date);
      expect(updateCall.data.status).toBe('CUSTOMER_SIGNED');
    });

    it('signs as operator when userId does not match customerId', async () => {
      prisma.contract.findUnique.mockResolvedValue({
        id: contractId,
        status: 'DRAFT',
        expiresAt: futureDate,
        customerSignedAt: null,
        operatorSignedAt: null,
        booking: { customerId },
      });
      prisma.contract.update.mockResolvedValue({
        id: contractId,
        status: 'SENT',
        operatorSignedAt: new Date(),
      });

      const result = await service.sign(contractId, operatorId);
      expect(result.success).toBe(true);

      const updateCall = prisma.contract.update.mock.calls[0][0];
      expect(updateCall.data.operatorSignedAt).toBeInstanceOf(Date);
      expect(updateCall.data.status).toBe('SENT');
    });

    it('sets status to FULLY_SIGNED when both customer and operator have signed', async () => {
      prisma.contract.findUnique.mockResolvedValue({
        id: contractId,
        status: 'SENT',
        expiresAt: futureDate,
        customerSignedAt: null,
        operatorSignedAt: new Date(),
        booking: { customerId },
      });
      prisma.contract.update.mockResolvedValue({
        id: contractId,
        status: 'FULLY_SIGNED',
      });

      await service.sign(contractId, customerId);

      const updateCall = prisma.contract.update.mock.calls[0][0];
      expect(updateCall.data.status).toBe('FULLY_SIGNED');
    });

    it('emits contract.signed event', async () => {
      prisma.contract.findUnique.mockResolvedValue({
        id: contractId,
        status: 'DRAFT',
        expiresAt: futureDate,
        customerSignedAt: null,
        operatorSignedAt: null,
        booking: { customerId },
      });
      prisma.contract.update.mockResolvedValue({ id: contractId, status: 'CUSTOMER_SIGNED' });

      await service.sign(contractId, customerId);
      expect(events.emit).toHaveBeenCalledWith('contract.signed', {
        contract: expect.any(Object),
        signedBy: customerId,
      });
    });

    it('throws NotFoundException when contract does not exist', async () => {
      prisma.contract.findUnique.mockResolvedValue(null);
      await expect(service.sign(contractId, customerId)).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when contract is expired', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      prisma.contract.findUnique.mockResolvedValue({
        id: contractId,
        status: 'DRAFT',
        expiresAt: pastDate,
        booking: { customerId },
      });

      await expect(service.sign(contractId, customerId)).rejects.toThrow(BadRequestException);
      expect(prisma.contract.update).toHaveBeenCalledWith({
        where: { id: contractId },
        data: { status: 'EXPIRED' },
      });
    });

    it('throws BadRequestException when contract status is not DRAFT or SENT', async () => {
      prisma.contract.findUnique.mockResolvedValue({
        id: contractId,
        status: 'FULLY_SIGNED',
        expiresAt: futureDate,
        booking: { customerId },
      });

      await expect(service.sign(contractId, customerId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByBooking', () => {
    it('returns contract for given booking', async () => {
      const mockContract = {
        id: 'contract-1',
        bookingId: 'booking-1',
        booking: {
          bookingNumber: 'KRF-001',
          status: 'CONFIRMED',
          customer: { fullNameAr: 'محمد أحمد' },
          caravan: { titleAr: 'كرفان فاخر' },
        },
      };
      prisma.contract.findUnique.mockResolvedValue(mockContract);

      const result = await service.findByBooking('booking-1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockContract);
    });

    it('throws NotFoundException when no contract exists for booking', async () => {
      prisma.contract.findUnique.mockResolvedValue(null);
      await expect(service.findByBooking('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
