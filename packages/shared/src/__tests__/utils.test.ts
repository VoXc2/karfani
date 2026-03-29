import { describe, it, expect } from 'vitest';
import {
  formatSaudiPhone,
  validateSaudiPhone,
  generateBookingNumber,
  generateTicketNumber,
  calculateVAT,
  formatSAR,
  isWeekend,
  calculateBookingDays,
  calculateBookingPrice,
} from '../utils';

describe('formatSaudiPhone', () => {
  it('returns unchanged when already in +966 format', () => {
    expect(formatSaudiPhone('+966512345678')).toBe('+966512345678');
  });

  it('adds + prefix when starting with 966', () => {
    expect(formatSaudiPhone('966512345678')).toBe('+966512345678');
  });

  it('converts 05x format to +966', () => {
    expect(formatSaudiPhone('0512345678')).toBe('+966512345678');
  });

  it('converts 5x format to +966', () => {
    expect(formatSaudiPhone('512345678')).toBe('+966512345678');
  });

  it('strips spaces and dashes before formatting', () => {
    expect(formatSaudiPhone('05 1234 5678')).toBe('+966512345678');
    expect(formatSaudiPhone('05-1234-5678')).toBe('+966512345678');
    expect(formatSaudiPhone('+966 51 234 5678')).toBe('+966512345678');
  });

  it('strips parentheses before formatting', () => {
    expect(formatSaudiPhone('(05)12345678')).toBe('+966512345678');
  });

  it('returns cleaned string for unrecognized formats', () => {
    expect(formatSaudiPhone('+1234567890')).toBe('+1234567890');
  });
});

describe('validateSaudiPhone', () => {
  it('returns true for valid +966 format', () => {
    expect(validateSaudiPhone('+966512345678')).toBe(true);
  });

  it('returns true for valid 05x format (internally formatted)', () => {
    expect(validateSaudiPhone('0512345678')).toBe(true);
  });

  it('returns true for valid 5x format', () => {
    expect(validateSaudiPhone('512345678')).toBe(true);
  });

  it('returns false for too short number', () => {
    expect(validateSaudiPhone('+96651234')).toBe(false);
  });

  it('returns false for too long number', () => {
    expect(validateSaudiPhone('+9665123456789')).toBe(false);
  });

  it('returns false for non-Saudi number', () => {
    expect(validateSaudiPhone('+1234567890')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateSaudiPhone('')).toBe(false);
  });
});

describe('generateBookingNumber', () => {
  it('starts with KRF- prefix', () => {
    const num = generateBookingNumber();
    expect(num).toMatch(/^KRF-/);
  });

  it('has correct total length (KRF- + 6 chars = 10)', () => {
    const num = generateBookingNumber();
    expect(num).toHaveLength(10);
  });

  it('uses only allowed characters (no ambiguous 0/O/1/I)', () => {
    const allowedChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < 20; i++) {
      const num = generateBookingNumber();
      const suffix = num.slice(4);
      for (const char of suffix) {
        expect(allowedChars).toContain(char);
      }
    }
  });

  it('generates unique numbers', () => {
    const numbers = new Set(Array.from({ length: 50 }, () => generateBookingNumber()));
    expect(numbers.size).toBeGreaterThan(45);
  });
});

describe('generateTicketNumber', () => {
  it('starts with TKT- prefix', () => {
    const num = generateTicketNumber();
    expect(num).toMatch(/^TKT-/);
  });

  it('has correct total length (TKT- + 6 chars = 10)', () => {
    const num = generateTicketNumber();
    expect(num).toHaveLength(10);
  });

  it('uses only allowed characters', () => {
    const allowedChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < 20; i++) {
      const num = generateTicketNumber();
      const suffix = num.slice(4);
      for (const char of suffix) {
        expect(allowedChars).toContain(char);
      }
    }
  });
});

describe('calculateVAT', () => {
  it('calculates VAT at 15% for round number', () => {
    const result = calculateVAT(100);
    expect(result.subtotal).toBe(100);
    expect(result.vat).toBe(15);
    expect(result.total).toBe(115);
  });

  it('rounds fractional amounts to 2 decimal places', () => {
    const result = calculateVAT(99.99);
    expect(result.subtotal).toBe(99.99);
    expect(result.vat).toBe(15);
    expect(result.total).toBe(114.99);
  });

  it('handles zero amount', () => {
    const result = calculateVAT(0);
    expect(result.subtotal).toBe(0);
    expect(result.vat).toBe(0);
    expect(result.total).toBe(0);
  });

  it('handles large amounts without overflow', () => {
    const result = calculateVAT(1000000);
    expect(result.subtotal).toBe(1000000);
    expect(result.vat).toBe(150000);
    expect(result.total).toBe(1150000);
  });
});

describe('formatSAR', () => {
  it('formats with Arabic locale by default', () => {
    const result = formatSAR(1500);
    // Arabic locale uses Arabic-Indic numerals (١٥٠٠) and SAR symbol (ر.س.)
    expect(result).toContain('ر.س.');
  });

  it('formats with English locale when specified', () => {
    const result = formatSAR(1500, 'en-SA');
    expect(result).toContain('1,500.00');
  });
});

describe('isWeekend', () => {
  it('returns true for Friday (day = 5)', () => {
    // Find a known Friday
    const friday = new Date('2026-03-27'); // March 27, 2026 is Friday
    expect(isWeekend(friday)).toBe(true);
  });

  it('returns true for Saturday (day = 6)', () => {
    const saturday = new Date('2026-03-28');
    expect(isWeekend(saturday)).toBe(true);
  });

  it('returns false for Sunday through Thursday', () => {
    const sunday = new Date('2026-03-29'); // Sunday
    const monday = new Date('2026-03-30');
    const tuesday = new Date('2026-03-31');
    const wednesday = new Date('2026-04-01');
    const thursday = new Date('2026-04-02');

    expect(isWeekend(sunday)).toBe(false);
    expect(isWeekend(monday)).toBe(false);
    expect(isWeekend(tuesday)).toBe(false);
    expect(isWeekend(wednesday)).toBe(false);
    expect(isWeekend(thursday)).toBe(false);
  });
});

describe('calculateBookingDays', () => {
  it('calculates correct days for multi-day range', () => {
    const start = new Date('2026-04-01');
    const end = new Date('2026-04-05');
    expect(calculateBookingDays(start, end)).toBe(4);
  });

  it('calculates correct days for cross-month range', () => {
    const start = new Date('2026-03-28');
    const end = new Date('2026-04-05');
    expect(calculateBookingDays(start, end)).toBe(8);
  });

  it('returns 0 for same start and end date', () => {
    const date = new Date('2026-04-01');
    expect(calculateBookingDays(date, date)).toBe(0);
  });

  it('returns 1 for single day booking', () => {
    const start = new Date('2026-04-01');
    const end = new Date('2026-04-02');
    expect(calculateBookingDays(start, end)).toBe(1);
  });
});

describe('calculateBookingPrice', () => {
  // Sun Mar 29 to Thu Apr 2 = 4 weekdays, 0 weekend days
  const weekdayStart = new Date('2026-03-29'); // Sunday
  const weekdayEnd = new Date('2026-04-02'); // Thursday

  it('calculates weekday-only booking using dailyRate', () => {
    const result = calculateBookingPrice(200, null, weekdayStart, weekdayEnd);
    expect(result.days).toBe(4);
    expect(result.weekdays).toBe(4);
    expect(result.weekendDays).toBe(0);
    expect(result.basePrice).toBe(800); // 4 * 200
  });

  it('uses weekendRate for weekend days', () => {
    // Fri Mar 27 to Sun Mar 29 = Fri + Sat = 2 weekend days
    const start = new Date('2026-03-27'); // Friday
    const end = new Date('2026-03-29'); // Sunday
    const result = calculateBookingPrice(200, 300, start, end);
    expect(result.weekendDays).toBe(2);
    expect(result.weekdays).toBe(0);
    expect(result.basePrice).toBe(600); // 2 * 300
  });

  it('handles mixed weekday/weekend booking', () => {
    // Wed Mar 25 to Mon Mar 30 = 3 weekdays + 2 weekend days
    const start = new Date('2026-03-25'); // Wednesday
    const end = new Date('2026-03-30'); // Monday
    const result = calculateBookingPrice(200, 300, start, end);
    expect(result.days).toBe(5);
    expect(result.weekdays).toBe(3);
    expect(result.weekendDays).toBe(2);
    expect(result.basePrice).toBe(3 * 200 + 2 * 300); // 1200
  });

  it('falls back to dailyRate when weekendRate is null', () => {
    const start = new Date('2026-03-27'); // Friday
    const end = new Date('2026-03-29'); // Sunday
    const result = calculateBookingPrice(200, null, start, end);
    expect(result.basePrice).toBe(400); // 2 * 200 (dailyRate used for weekends)
  });

  it('applies weekly discount for 7+ day booking', () => {
    // 7 days booking with 10% weekly discount
    const start = new Date('2026-03-29'); // Sunday
    const end = new Date('2026-04-05'); // Sunday (7 days)
    const result = calculateBookingPrice(200, null, start, end, 10);
    expect(result.days).toBe(7);
    expect(result.discountAmount).toBeGreaterThan(0);
    expect(result.subtotal).toBeLessThan(result.basePrice);
  });

  it('applies monthly discount for 30+ day booking', () => {
    const start = new Date('2026-04-01');
    const end = new Date('2026-05-01'); // 30 days
    const result = calculateBookingPrice(200, null, start, end, 10, 20);
    expect(result.days).toBe(30);
    // Monthly discount (20%) should be applied, not weekly (10%)
    const expectedDiscount = Math.round(result.basePrice * 0.20 * 100) / 100;
    expect(result.discountAmount).toBe(expectedDiscount);
  });

  it('does not apply monthly discount for < 30 days even if provided', () => {
    const start = new Date('2026-03-29');
    const end = new Date('2026-04-05'); // 7 days
    const result = calculateBookingPrice(200, null, start, end, 10, 20);
    // Should apply weekly (10%), not monthly (20%)
    const expectedDiscount = Math.round(result.basePrice * 0.10 * 100) / 100;
    expect(result.discountAmount).toBe(expectedDiscount);
  });

  it('applies no discount when booking is less than 7 days', () => {
    const result = calculateBookingPrice(200, null, weekdayStart, weekdayEnd, 10, 20);
    expect(result.days).toBe(4);
    expect(result.discountAmount).toBe(0);
  });

  it('calculates VAT at 15% on subtotal', () => {
    const result = calculateBookingPrice(100, null, weekdayStart, weekdayEnd);
    expect(result.subtotal).toBe(400);
    expect(result.vat).toBe(60); // 400 * 0.15
    expect(result.total).toBe(460);
  });

  it('calculates correct total with discount and VAT', () => {
    const start = new Date('2026-03-29');
    const end = new Date('2026-04-05'); // 7 days
    const result = calculateBookingPrice(200, null, start, end, 10);
    const expectedBase = result.basePrice;
    const expectedDiscount = Math.round(expectedBase * 0.10 * 100) / 100;
    const expectedSubtotal = Math.round((expectedBase - expectedDiscount) * 100) / 100;
    const expectedVat = Math.round(expectedSubtotal * 0.15 * 100) / 100;
    const expectedTotal = Math.round((expectedSubtotal + expectedVat) * 100) / 100;

    expect(result.discountAmount).toBe(expectedDiscount);
    expect(result.subtotal).toBe(expectedSubtotal);
    expect(result.vat).toBe(expectedVat);
    expect(result.total).toBe(expectedTotal);
  });

  it('handles single day booking', () => {
    const start = new Date('2026-03-29'); // Sunday
    const end = new Date('2026-03-30'); // Monday
    const result = calculateBookingPrice(200, 300, start, end);
    expect(result.days).toBe(1);
    expect(result.weekdays).toBe(1);
    expect(result.weekendDays).toBe(0);
    expect(result.basePrice).toBe(200);
  });
});
