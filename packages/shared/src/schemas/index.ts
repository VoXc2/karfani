import { z } from 'zod';

const SAUDI_PHONE_REGEX = /^\+966[0-9]{9}$/;

export const loginSchema = z.object({
  phone: z.string().regex(SAUDI_PHONE_REGEX, 'رقم الجوال غير صحيح. استخدم الصيغة +966XXXXXXXXX'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(SAUDI_PHONE_REGEX),
  otp: z.string().length(6, 'رمز التحقق يجب أن يكون 6 أرقام').regex(/^\d{6}$/),
});

export const createCaravanSchema = z.object({
  titleAr: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل').max(200),
  titleEn: z.string().max(200).optional(),
  descriptionAr: z.string().min(20, 'الوصف يجب أن يكون 20 حرف على الأقل').max(2000),
  descriptionEn: z.string().max(2000).optional(),
  type: z.enum(['MOTORHOME', 'TRAILER', 'CAMPERVAN', 'POPUP', 'FIFTH_WHEEL']),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(2000).max(new Date().getFullYear() + 1),
  plateNumber: z.string().min(1).max(20),
  sleeps: z.number().int().min(1).max(20),
  length: z.number().positive().optional(),
  amenities: z.object({
    water: z.boolean().default(false),
    power: z.boolean().default(false),
    ac: z.boolean().default(false),
    kitchen: z.boolean().default(false),
    bathroom: z.boolean().default(false),
    wifi: z.boolean().default(false),
    generator: z.boolean().default(false),
    solar: z.boolean().default(false),
    tv: z.boolean().default(false),
    awning: z.boolean().default(false),
  }),
  deliveryEnabled: z.boolean().default(false),
  deliveryFee: z.number().min(0).optional(),
  pickupLocationId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  dailyRate: z.number().positive('السعر اليومي مطلوب'),
  weekendRate: z.number().positive().optional(),
  weeklyDiscount: z.number().min(0).max(100).optional(),
  monthlyDiscount: z.number().min(0).max(100).optional(),
  securityDeposit: z.number().min(0),
  minDays: z.number().int().min(1).default(1),
  maxDays: z.number().int().min(1).optional(),
});

export const updateCaravanSchema = createCaravanSchema.partial();

export const searchCaravansSchema = z.object({
  city: z.string().optional(),
  region: z.string().optional(),
  type: z.enum(['MOTORHOME', 'TRAILER', 'CAMPERVAN', 'POPUP', 'FIFTH_WHEEL']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sleeps: z.number().int().min(1).optional(),
  amenities: z.array(z.string()).optional(),
  deliveryEnabled: z.boolean().optional(),
  sortBy: z.enum(['dailyRate', 'rating', 'reviewCount', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createBookingSchema = z.object({
  caravanId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  addons: z.array(z.object({
    nameAr: z.string(),
    nameEn: z.string().optional(),
    quantity: z.number().int().min(1).default(1),
    unitPrice: z.number().positive(),
  })).default([]),
  deliveryAddress: z.string().optional(),
  deliveryLatitude: z.number().optional(),
  deliveryLongitude: z.number().optional(),
  pickupLocationId: z.string().optional(),
  specialRequests: z.string().max(500).optional(),
  promoCode: z.string().optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية', path: ['endDate'] }
);

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'التقييم مطلوب').max(5),
  comment: z.string().max(1000).optional(),
  photos: z.array(z.string().url()).max(5).optional(),
});

export const createTicketSchema = z.object({
  bookingId: z.string().optional(),
  category: z.enum(['BOOKING', 'PAYMENT', 'CARAVAN', 'DAMAGE', 'GENERAL', 'EMERGENCY']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
});

export const createInspectionSchema = z.object({
  bookingId: z.string().min(1),
  type: z.enum(['PRE_TRIP', 'POST_TRIP', 'MAINTENANCE_CHECK', 'INCIDENT']),
  odometerKm: z.number().int().min(0).optional(),
  fuelLevel: z.number().int().min(0).max(100).optional(),
  cleanlinessScore: z.number().int().min(1).max(5).optional(),
  overallScore: z.number().int().min(1).max(5).optional(),
  checklist: z.array(z.object({
    item: z.string(),
    passed: z.boolean(),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports for use in services
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type CreateCaravanInput = z.infer<typeof createCaravanSchema>;
export type UpdateCaravanInput = z.infer<typeof updateCaravanSchema>;
export type SearchCaravansInput = z.infer<typeof searchCaravansSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type CreateInspectionInput = z.infer<typeof createInspectionSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
