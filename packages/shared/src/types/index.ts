// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// User Types
export type UserRole = 'CUSTOMER' | 'OWNER' | 'INSPECTOR' | 'DISPATCHER' | 'SUPPORT_AGENT' | 'OPS_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  phone: string;
  email?: string;
  fullNameAr: string;
  fullNameEn?: string;
  roles: UserRole[];
  locale: 'ar' | 'en';
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerProfile {
  id: string;
  userId: string;
  companyNameAr?: string;
  companyNameEn?: string;
  crNumber?: string;
  iban: string;
  commissionRate: number;
  isVerified: boolean;
  bio?: string;
}

// Caravan Types
export type CaravanType = 'MOTORHOME' | 'TRAILER' | 'CAMPERVAN' | 'POPUP' | 'FIFTH_WHEEL';
export type CaravanStatus = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'SUSPENDED' | 'MAINTENANCE';

export interface CaravanAmenities {
  water: boolean;
  power: boolean;
  ac: boolean;
  kitchen: boolean;
  bathroom: boolean;
  wifi: boolean;
  generator: boolean;
  solar: boolean;
  tv: boolean;
  awning: boolean;
}

export interface Caravan {
  id: string;
  ownerId: string;
  titleAr: string;
  titleEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  type: CaravanType;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  sleeps: number;
  length?: number;
  amenities: CaravanAmenities;
  status: CaravanStatus;
  deliveryEnabled: boolean;
  deliveryFee?: number;
  pickupLocationId?: string;
  latitude?: number;
  longitude?: number;
  dailyRate: number;
  weekendRate?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  securityDeposit: number;
  minDays: number;
  maxDays?: number;
  rating?: number;
  reviewCount: number;
  media?: CaravanMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface CaravanMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'PHOTO' | 'VIDEO' | 'PANORAMA';
  caption?: string;
  sortOrder: number;
}

// Location Types
export type LocationType = 'CITY' | 'HUB' | 'CAMPSITE' | 'PICKUP_POINT' | 'DROPOFF_POINT';

export interface Location {
  id: string;
  type: LocationType;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  address?: string;
  facilities?: Record<string, boolean>;
  capacity?: number;
  isActive: boolean;
}

// Route Types
export type RouteDifficulty = 'EASY' | 'MODERATE' | 'CHALLENGING' | 'EXPERT';

export interface Waypoint {
  lat: number;
  lng: number;
  nameAr: string;
  nameEn?: string;
  description?: string;
  order: number;
}

export interface Route {
  id: string;
  titleAr: string;
  titleEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  difficulty: RouteDifficulty;
  distanceKm: number;
  durationDays: number;
  waypoints: Waypoint[];
  seasonStart?: number;
  seasonEnd?: number;
  coverImageUrl?: string;
  isActive: boolean;
  rating?: number;
  reviewCount: number;
}

// Booking Types
export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'PREPARING' | 'DISPATCHED' | 'HANDED_OVER' | 'ACTIVE' | 'RETURN_PENDING' | 'RETURNED' | 'POST_INSPECTION' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export interface BookingAddon {
  id: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  caravanId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: BookingStatus;
  basePrice: number;
  addonsPrice: number;
  deliveryPrice: number;
  discountAmount: number;
  vatAmount: number;
  totalPrice: number;
  securityDeposit: number;
  depositRefunded: number;
  pickupLocationId?: string;
  dropoffLocationId?: string;
  deliveryAddress?: string;
  specialRequests?: string;
  cancellationReason?: string;
  addons?: BookingAddon[];
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export type PaymentType = 'BOOKING_PAYMENT' | 'SECURITY_DEPOSIT' | 'DAMAGE_CHARGE' | 'ADDON_PAYMENT' | 'REFUND';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'mada' | 'apple_pay' | 'stc_pay' | 'visa' | 'mastercard';

export interface Payment {
  id: string;
  bookingId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  gatewayId?: string;
  method?: PaymentMethod;
  paidAt?: string;
  createdAt: string;
}

// Inspection Types
export type InspectionType = 'PRE_TRIP' | 'POST_TRIP' | 'MAINTENANCE_CHECK' | 'INCIDENT';

export interface ChecklistItem {
  item: string;
  passed: boolean;
  notes?: string;
}

export interface Inspection {
  id: string;
  bookingId: string;
  inspectorId: string;
  type: InspectionType;
  odometerKm?: number;
  fuelLevel?: number;
  cleanlinessScore?: number;
  overallScore?: number;
  checklist: ChecklistItem[];
  notes?: string;
  completedAt?: string;
}

// Damage Types
export type DamageSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
export type DamageStatus = 'REPORTED' | 'ASSESSING' | 'ASSESSED' | 'CUSTOMER_RESPONSE' | 'RESOLVED' | 'DISPUTED';

export interface DamageReport {
  id: string;
  bookingId: string;
  inspectionId?: string;
  reportedById: string;
  severity: DamageSeverity;
  description: string;
  estimatedCost?: number;
  actualCost?: number;
  depositDeduction?: number;
  status: DamageStatus;
}

// Support Types
export type TicketCategory = 'BOOKING' | 'PAYMENT' | 'CARAVAN' | 'DAMAGE' | 'GENERAL' | 'EMERGENCY';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'WAITING_INTERNAL' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  bookingId?: string;
  userId: string;
  assignedToId?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
}

// Review Types
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  caravanId: string;
  rating: number;
  comment?: string;
  ownerReply?: string;
  photos?: string[];
  createdAt: string;
}

// Pricing Types
export type PricingRuleType = 'BASE' | 'WEEKEND' | 'SEASONAL' | 'EVENT' | 'LONG_STAY';

export interface PricingRule {
  id: string;
  caravanId: string;
  type: PricingRuleType;
  name: string;
  dailyRate: number;
  startDate?: string;
  endDate?: string;
  daysOfWeek?: number[];
  priority: number;
  isActive: boolean;
}

// Contract Types
export type ContractStatus = 'DRAFT' | 'SENT' | 'CUSTOMER_SIGNED' | 'FULLY_SIGNED' | 'EXPIRED' | 'CANCELLED';

export interface Contract {
  id: string;
  bookingId: string;
  templateVersion: string;
  pdfUrl?: string;
  status: ContractStatus;
  customerSignedAt?: string;
  operatorSignedAt?: string;
}

// Notification Types
export type NotificationChannel = 'SMS' | 'WHATSAPP' | 'PUSH' | 'EMAIL' | 'IN_APP';

export interface Notification {
  id: string;
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sentAt?: string;
  readAt?: string;
}

// Booking Price Calculation
export interface BookingPriceBreakdown {
  days: number;
  weekdays: number;
  weekendDays: number;
  basePrice: number;
  discountAmount: number;
  subtotal: number;
  vat: number;
  total: number;
}
