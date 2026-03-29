import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PricingService } from '../pricing.service';
import { createMockPrismaService, type MockPrismaService } from '../../../../test/helpers/prisma-mock';

describe('PricingService', () => {
  let service: PricingService;
  let prisma: MockPrismaService;

  beforeEach(() => {
    prisma = createMockPrismaService();
    service = new PricingService(prisma as any);
  });

  describe('calculatePrice', () => {
    it('calculates price using caravan rates', async () => {
      prisma.caravan.findUniqueOrThrow.mockResolvedValue({
        id: 'caravan-1',
        dailyRate: 200,
        weekendRate: 300,
        weeklyDiscount: 10,
        monthlyDiscount: 20,
        securityDeposit: 1000,
      });

      const result = await service.calculatePrice('caravan-1', new Date('2026-04-01'), new Date('2026-04-04'));
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('days');
      expect(result.data).toHaveProperty('basePrice');
      expect(result.data).toHaveProperty('total');
    });

    it('includes securityDeposit from caravan', async () => {
      prisma.caravan.findUniqueOrThrow.mockResolvedValue({
        id: 'caravan-1',
        dailyRate: 200,
        weekendRate: null,
        weeklyDiscount: null,
        monthlyDiscount: null,
        securityDeposit: 2500,
      });

      const result = await service.calculatePrice('caravan-1', new Date('2026-04-01'), new Date('2026-04-04'));
      expect(result.data.securityDeposit).toBe(2500);
    });

    it('throws when caravan not found', async () => {
      prisma.caravan.findUniqueOrThrow.mockRejectedValue(new Error('Not found'));
      await expect(
        service.calculatePrice('nonexistent', new Date('2026-04-01'), new Date('2026-04-04')),
      ).rejects.toThrow();
    });
  });

  describe('addRule', () => {
    it('creates a pricing rule for the caravan', async () => {
      const ruleData = { name: 'Summer Special', discountPercent: 15 };
      prisma.pricingRule.create.mockResolvedValue({ id: 'rule-1', ...ruleData, caravanId: 'caravan-1' });

      const result = await service.addRule('caravan-1', ruleData);
      expect(result.success).toBe(true);
      expect(prisma.pricingRule.create).toHaveBeenCalledWith({
        data: { ...ruleData, caravanId: 'caravan-1' },
      });
    });
  });
});
