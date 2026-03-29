import { VAT_RATE, WEEKEND_DAYS, BOOKING_NUMBER_PREFIX, TICKET_NUMBER_PREFIX, SAUDI_PHONE_REGEX } from '../constants';

export function formatSaudiPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+966')) return cleaned;
  if (cleaned.startsWith('966')) return `+${cleaned}`;
  if (cleaned.startsWith('05')) return `+966${cleaned.slice(1)}`;
  if (cleaned.startsWith('5')) return `+966${cleaned}`;
  return cleaned;
}

export function validateSaudiPhone(phone: string): boolean {
  return SAUDI_PHONE_REGEX.test(formatSaudiPhone(phone));
}

export function generateBookingNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${BOOKING_NUMBER_PREFIX}-${result}`;
}

export function generateTicketNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${TICKET_NUMBER_PREFIX}-${result}`;
}

export function calculateVAT(amount: number): { subtotal: number; vat: number; total: number } {
  const subtotal = Math.round(amount * 100) / 100;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;
  return { subtotal, vat, total };
}

export function formatSAR(amount: number, locale: string = 'ar-SA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return (WEEKEND_DAYS as readonly number[]).includes(day);
}

export function calculateBookingDays(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateBookingPrice(
  dailyRate: number,
  weekendRate: number | null,
  startDate: Date,
  endDate: Date,
  weeklyDiscount?: number,
  monthlyDiscount?: number,
): { days: number; weekdays: number; weekendDays: number; basePrice: number; discountAmount: number; subtotal: number; vat: number; total: number } {
  const days = calculateBookingDays(startDate, endDate);
  let weekdays = 0;
  let weekendDays = 0;
  let basePrice = 0;

  const current = new Date(startDate);
  for (let i = 0; i < days; i++) {
    if (isWeekend(current)) {
      weekendDays++;
      basePrice += weekendRate ?? dailyRate;
    } else {
      weekdays++;
      basePrice += dailyRate;
    }
    current.setDate(current.getDate() + 1);
  }

  let discountPercent = 0;
  if (monthlyDiscount && days >= 30) {
    discountPercent = monthlyDiscount;
  } else if (weeklyDiscount && days >= 7) {
    discountPercent = weeklyDiscount;
  }

  const discountAmount = Math.round(basePrice * (discountPercent / 100) * 100) / 100;
  const subtotal = Math.round((basePrice - discountAmount) * 100) / 100;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;

  return { days, weekdays, weekendDays, basePrice, discountAmount, subtotal, vat, total };
}
