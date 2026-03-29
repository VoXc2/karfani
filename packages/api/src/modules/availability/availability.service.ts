import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getMonthAvailability(caravanId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const slots = await this.prisma.availabilitySlot.findMany({
      where: { caravanId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'asc' },
    });
    return { success: true, data: slots };
  }

  async checkAvailability(caravanId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const unavailable = await this.prisma.availabilitySlot.count({
      where: { caravanId, date: { gte: startDate, lt: endDate }, isAvailable: false },
    });
    return unavailable === 0;
  }

  async blockDates(caravanId: string, dates: string[], reason?: string) {
    for (const dateStr of dates) {
      const date = new Date(dateStr);
      await this.prisma.availabilitySlot.upsert({
        where: { caravanId_date: { caravanId, date } },
        update: { isAvailable: false, blockReason: reason || 'manual_block' },
        create: { caravanId, date, isAvailable: false, blockReason: reason || 'manual_block' },
      });
    }
    return { success: true, message: 'تم حجب التواريخ' };
  }

  async markBooked(caravanId: string, startDate: Date, endDate: Date) {
    const current = new Date(startDate);
    while (current < endDate) {
      await this.prisma.availabilitySlot.upsert({
        where: { caravanId_date: { caravanId, date: new Date(current) } },
        update: { isAvailable: false, blockReason: 'booked' },
        create: { caravanId, date: new Date(current), isAvailable: false, blockReason: 'booked' },
      });
      current.setDate(current.getDate() + 1);
    }
  }
}
