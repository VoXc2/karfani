import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { calculateBookingPrice } from '@karfani/shared';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async calculatePrice(caravanId: string, startDate: Date, endDate: Date) {
    const caravan = await this.prisma.caravan.findUniqueOrThrow({ where: { id: caravanId } });
    const breakdown = calculateBookingPrice(
      Number(caravan.dailyRate),
      caravan.weekendRate ? Number(caravan.weekendRate) : null,
      startDate,
      endDate,
      caravan.weeklyDiscount ? Number(caravan.weeklyDiscount) : undefined,
      caravan.monthlyDiscount ? Number(caravan.monthlyDiscount) : undefined,
    );
    return { success: true, data: { ...breakdown, securityDeposit: Number(caravan.securityDeposit) } };
  }

  async addRule(caravanId: string, data: any) {
    const rule = await this.prisma.pricingRule.create({ data: { ...data, caravanId } });
    return { success: true, data: rule };
  }
}
