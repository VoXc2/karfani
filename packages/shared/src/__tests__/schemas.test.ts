import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  verifyOtpSchema,
  createCaravanSchema,
  createBookingSchema,
  createReviewSchema,
  createTicketSchema,
  createInspectionSchema,
  paginationSchema,
  searchCaravansSchema,
} from '../schemas';

describe('loginSchema', () => {
  it('accepts valid +966 phone number', () => {
    const result = loginSchema.safeParse({ phone: '+966512345678' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid phone format', () => {
    const result = loginSchema.safeParse({ phone: '0512345678' });
    expect(result.success).toBe(false);
  });

  it('rejects missing phone', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects non-Saudi phone number', () => {
    const result = loginSchema.safeParse({ phone: '+1234567890' });
    expect(result.success).toBe(false);
  });

  it('returns Arabic error message for invalid phone', () => {
    const result = loginSchema.safeParse({ phone: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('رقم الجوال');
    }
  });
});

describe('verifyOtpSchema', () => {
  it('accepts valid 6-digit OTP', () => {
    const result = verifyOtpSchema.safeParse({ phone: '+966512345678', otp: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects non-numeric OTP', () => {
    const result = verifyOtpSchema.safeParse({ phone: '+966512345678', otp: 'abcdef' });
    expect(result.success).toBe(false);
  });

  it('rejects OTP with wrong length', () => {
    const result = verifyOtpSchema.safeParse({ phone: '+966512345678', otp: '12345' });
    expect(result.success).toBe(false);
  });

  it('rejects OTP with 7 digits', () => {
    const result = verifyOtpSchema.safeParse({ phone: '+966512345678', otp: '1234567' });
    expect(result.success).toBe(false);
  });
});

describe('createCaravanSchema', () => {
  const validCaravan = {
    titleAr: 'كرفان فاخر للإيجار',
    descriptionAr: 'كرفان فاخر مجهز بالكامل للرحلات البرية والتخييم',
    type: 'MOTORHOME' as const,
    make: 'Airstream',
    model: 'Classic',
    year: 2024,
    plateNumber: 'ABC1234',
    sleeps: 4,
    amenities: {
      water: true,
      power: true,
      ac: true,
      kitchen: true,
      bathroom: true,
      wifi: false,
      generator: false,
      solar: false,
      tv: false,
      awning: false,
    },
    dailyRate: 500,
    securityDeposit: 2000,
  };

  it('accepts valid full caravan data', () => {
    const result = createCaravanSchema.safeParse(validCaravan);
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 5 characters', () => {
    const result = createCaravanSchema.safeParse({ ...validCaravan, titleAr: 'كرف' });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 20 characters', () => {
    const result = createCaravanSchema.safeParse({ ...validCaravan, descriptionAr: 'وصف قصير' });
    expect(result.success).toBe(false);
  });

  it('rejects year before 2000', () => {
    const result = createCaravanSchema.safeParse({ ...validCaravan, year: 1999 });
    expect(result.success).toBe(false);
  });

  it('rejects negative dailyRate', () => {
    const result = createCaravanSchema.safeParse({ ...validCaravan, dailyRate: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects zero dailyRate', () => {
    const result = createCaravanSchema.safeParse({ ...validCaravan, dailyRate: 0 });
    expect(result.success).toBe(false);
  });

  it('accepts optional English fields', () => {
    const result = createCaravanSchema.safeParse({
      ...validCaravan,
      titleEn: 'Luxury Caravan for Rent',
      descriptionEn: 'Fully equipped luxury caravan for desert trips and camping.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid caravan type', () => {
    const result = createCaravanSchema.safeParse({ ...validCaravan, type: 'INVALID_TYPE' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid caravan types', () => {
    const types = ['MOTORHOME', 'TRAILER', 'CAMPERVAN', 'POPUP', 'FIFTH_WHEEL'];
    for (const type of types) {
      const result = createCaravanSchema.safeParse({ ...validCaravan, type });
      expect(result.success).toBe(true);
    }
  });

  it('validates weeklyDiscount is between 0 and 100', () => {
    expect(createCaravanSchema.safeParse({ ...validCaravan, weeklyDiscount: 50 }).success).toBe(true);
    expect(createCaravanSchema.safeParse({ ...validCaravan, weeklyDiscount: -1 }).success).toBe(false);
    expect(createCaravanSchema.safeParse({ ...validCaravan, weeklyDiscount: 101 }).success).toBe(false);
  });
});

describe('createBookingSchema', () => {
  const validBooking = {
    caravanId: 'caravan-123',
    startDate: '2026-04-10T00:00:00.000Z',
    endDate: '2026-04-15T00:00:00.000Z',
  };

  it('accepts valid booking data', () => {
    const result = createBookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it('rejects endDate before startDate', () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      startDate: '2026-04-15T00:00:00.000Z',
      endDate: '2026-04-10T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('defaults addons to empty array', () => {
    const result = createBookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.addons).toEqual([]);
    }
  });

  it('accepts booking with addons', () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      addons: [{ nameAr: 'كراسي تخييم', quantity: 2, unitPrice: 50 }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty caravanId', () => {
    const result = createBookingSchema.safeParse({ ...validBooking, caravanId: '' });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields', () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      deliveryAddress: 'Riyadh, Saudi Arabia',
      specialRequests: 'Extra blankets please',
      promoCode: 'DISCOUNT10',
    });
    expect(result.success).toBe(true);
  });

  it('rejects specialRequests longer than 500 chars', () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      specialRequests: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe('createReviewSchema', () => {
  it('accepts valid review with rating 1-5', () => {
    expect(createReviewSchema.safeParse({ rating: 1 }).success).toBe(true);
    expect(createReviewSchema.safeParse({ rating: 5 }).success).toBe(true);
  });

  it('rejects rating of 0', () => {
    expect(createReviewSchema.safeParse({ rating: 0 }).success).toBe(false);
  });

  it('rejects rating above 5', () => {
    expect(createReviewSchema.safeParse({ rating: 6 }).success).toBe(false);
  });

  it('accepts optional comment and photos', () => {
    const result = createReviewSchema.safeParse({
      rating: 4,
      comment: 'Great experience!',
      photos: ['https://example.com/photo1.jpg'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects more than 5 photos', () => {
    const result = createReviewSchema.safeParse({
      rating: 4,
      photos: Array(6).fill('https://example.com/photo.jpg'),
    });
    expect(result.success).toBe(false);
  });
});

describe('createTicketSchema', () => {
  const validTicket = {
    category: 'BOOKING' as const,
    subject: 'Issue with my booking',
    message: 'I need help with my recent booking. The dates are wrong.',
  };

  it('accepts valid ticket', () => {
    expect(createTicketSchema.safeParse(validTicket).success).toBe(true);
  });

  it('rejects subject shorter than 5 chars', () => {
    expect(createTicketSchema.safeParse({ ...validTicket, subject: 'Hi' }).success).toBe(false);
  });

  it('rejects message shorter than 10 chars', () => {
    expect(createTicketSchema.safeParse({ ...validTicket, message: 'Short' }).success).toBe(false);
  });

  it('defaults priority to MEDIUM', () => {
    const result = createTicketSchema.safeParse(validTicket);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe('MEDIUM');
    }
  });

  it('accepts all valid categories', () => {
    const categories = ['BOOKING', 'PAYMENT', 'CARAVAN', 'DAMAGE', 'GENERAL', 'EMERGENCY'];
    for (const category of categories) {
      expect(createTicketSchema.safeParse({ ...validTicket, category }).success).toBe(true);
    }
  });
});

describe('createInspectionSchema', () => {
  const validInspection = {
    bookingId: 'booking-123',
    type: 'PRE_TRIP' as const,
    checklist: [
      { item: 'Tires', passed: true },
      { item: 'Brakes', passed: true, notes: 'Good condition' },
    ],
  };

  it('accepts valid inspection', () => {
    expect(createInspectionSchema.safeParse(validInspection).success).toBe(true);
  });

  it('accepts all inspection types', () => {
    const types = ['PRE_TRIP', 'POST_TRIP', 'MAINTENANCE_CHECK', 'INCIDENT'];
    for (const type of types) {
      expect(createInspectionSchema.safeParse({ ...validInspection, type }).success).toBe(true);
    }
  });

  it('accepts optional scores', () => {
    const result = createInspectionSchema.safeParse({
      ...validInspection,
      fuelLevel: 80,
      cleanlinessScore: 4,
      overallScore: 5,
    });
    expect(result.success).toBe(true);
  });

  it('rejects fuel level above 100', () => {
    expect(createInspectionSchema.safeParse({ ...validInspection, fuelLevel: 101 }).success).toBe(false);
  });
});

describe('paginationSchema', () => {
  it('applies default values', () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sortBy).toBe('createdAt');
      expect(result.data.sortOrder).toBe('desc');
    }
  });

  it('rejects page less than 1', () => {
    expect(paginationSchema.safeParse({ page: 0 }).success).toBe(false);
  });

  it('rejects limit above 100', () => {
    expect(paginationSchema.safeParse({ limit: 101 }).success).toBe(false);
  });
});

describe('searchCaravansSchema', () => {
  it('accepts empty search (all optional)', () => {
    expect(searchCaravansSchema.safeParse({}).success).toBe(true);
  });

  it('applies default sort values', () => {
    const result = searchCaravansSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortBy).toBe('createdAt');
      expect(result.data.sortOrder).toBe('desc');
    }
  });

  it('accepts all filter combinations', () => {
    const result = searchCaravansSchema.safeParse({
      city: 'Riyadh',
      type: 'MOTORHOME',
      minPrice: 100,
      maxPrice: 500,
      sleeps: 4,
      deliveryEnabled: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative minPrice', () => {
    expect(searchCaravansSchema.safeParse({ minPrice: -1 }).success).toBe(false);
  });
});
