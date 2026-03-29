export const USER_ROLES = ['CUSTOMER', 'OWNER', 'INSPECTOR', 'DISPATCHER', 'SUPPORT_AGENT', 'OPS_ADMIN', 'SUPER_ADMIN'] as const;

export const BOOKING_STATUSES = [
  { id: 'PENDING_PAYMENT', labelAr: 'بانتظار الدفع', labelEn: 'Pending Payment' },
  { id: 'CONFIRMED', labelAr: 'مؤكد', labelEn: 'Confirmed' },
  { id: 'PREPARING', labelAr: 'قيد التجهيز', labelEn: 'Preparing' },
  { id: 'DISPATCHED', labelAr: 'في الطريق', labelEn: 'Dispatched' },
  { id: 'HANDED_OVER', labelAr: 'تم التسليم', labelEn: 'Handed Over' },
  { id: 'ACTIVE', labelAr: 'نشط', labelEn: 'Active' },
  { id: 'RETURN_PENDING', labelAr: 'بانتظار الإرجاع', labelEn: 'Return Pending' },
  { id: 'RETURNED', labelAr: 'تم الإرجاع', labelEn: 'Returned' },
  { id: 'POST_INSPECTION', labelAr: 'قيد الفحص', labelEn: 'Post Inspection' },
  { id: 'COMPLETED', labelAr: 'مكتمل', labelEn: 'Completed' },
  { id: 'CANCELLED', labelAr: 'ملغي', labelEn: 'Cancelled' },
  { id: 'DISPUTED', labelAr: 'متنازع عليه', labelEn: 'Disputed' },
] as const;

export const CARAVAN_TYPES = [
  { id: 'MOTORHOME', labelAr: 'كرفان متنقل', labelEn: 'Motorhome' },
  { id: 'TRAILER', labelAr: 'مقطورة', labelEn: 'Trailer' },
  { id: 'CAMPERVAN', labelAr: 'فان مجهز', labelEn: 'Campervan' },
  { id: 'POPUP', labelAr: 'كرفان قابل للطي', labelEn: 'Pop-up' },
  { id: 'FIFTH_WHEEL', labelAr: 'العجلة الخامسة', labelEn: 'Fifth Wheel' },
] as const;

export const CARAVAN_STATUSES = [
  { id: 'DRAFT', labelAr: 'مسودة', labelEn: 'Draft' },
  { id: 'PENDING_REVIEW', labelAr: 'بانتظار المراجعة', labelEn: 'Pending Review' },
  { id: 'ACTIVE', labelAr: 'نشط', labelEn: 'Active' },
  { id: 'SUSPENDED', labelAr: 'معلق', labelEn: 'Suspended' },
  { id: 'MAINTENANCE', labelAr: 'صيانة', labelEn: 'Maintenance' },
] as const;

export const PAYMENT_METHODS = [
  { id: 'mada', labelAr: 'مدى', labelEn: 'mada', icon: 'mada' },
  { id: 'apple_pay', labelAr: 'Apple Pay', labelEn: 'Apple Pay', icon: 'apple' },
  { id: 'stc_pay', labelAr: 'STC Pay', labelEn: 'STC Pay', icon: 'stc' },
  { id: 'visa', labelAr: 'فيزا', labelEn: 'Visa', icon: 'visa' },
  { id: 'mastercard', labelAr: 'ماستركارد', labelEn: 'Mastercard', icon: 'mastercard' },
] as const;

export const SAUDI_REGIONS = [
  { id: 'riyadh', nameAr: 'منطقة الرياض', nameEn: 'Riyadh Region' },
  { id: 'makkah', nameAr: 'منطقة مكة المكرمة', nameEn: 'Makkah Region' },
  { id: 'madinah', nameAr: 'منطقة المدينة المنورة', nameEn: 'Madinah Region' },
  { id: 'eastern', nameAr: 'المنطقة الشرقية', nameEn: 'Eastern Region' },
  { id: 'qassim', nameAr: 'منطقة القصيم', nameEn: 'Qassim Region' },
  { id: 'hail', nameAr: 'منطقة حائل', nameEn: 'Hail Region' },
  { id: 'tabuk', nameAr: 'منطقة تبوك', nameEn: 'Tabuk Region' },
  { id: 'northern_borders', nameAr: 'منطقة الحدود الشمالية', nameEn: 'Northern Borders Region' },
  { id: 'jazan', nameAr: 'منطقة جازان', nameEn: 'Jazan Region' },
  { id: 'najran', nameAr: 'منطقة نجران', nameEn: 'Najran Region' },
  { id: 'bahah', nameAr: 'منطقة الباحة', nameEn: 'Al Bahah Region' },
  { id: 'jawf', nameAr: 'منطقة الجوف', nameEn: 'Al Jawf Region' },
  { id: 'asir', nameAr: 'منطقة عسير', nameEn: 'Asir Region' },
] as const;

export const TICKET_CATEGORIES = [
  { id: 'BOOKING', labelAr: 'حجز', labelEn: 'Booking' },
  { id: 'PAYMENT', labelAr: 'دفع', labelEn: 'Payment' },
  { id: 'CARAVAN', labelAr: 'كرفان', labelEn: 'Caravan' },
  { id: 'DAMAGE', labelAr: 'أضرار', labelEn: 'Damage' },
  { id: 'GENERAL', labelAr: 'عام', labelEn: 'General' },
  { id: 'EMERGENCY', labelAr: 'طوارئ', labelEn: 'Emergency' },
] as const;

export const DAMAGE_SEVERITIES = [
  { id: 'MINOR', labelAr: 'بسيط', labelEn: 'Minor', color: '#22c55e' },
  { id: 'MODERATE', labelAr: 'متوسط', labelEn: 'Moderate', color: '#f59e0b' },
  { id: 'MAJOR', labelAr: 'كبير', labelEn: 'Major', color: '#ef4444' },
  { id: 'CRITICAL', labelAr: 'حرج', labelEn: 'Critical', color: '#991b1b' },
] as const;

export const AMENITY_LABELS = {
  water: { ar: 'مياه', en: 'Water', icon: 'droplet' },
  power: { ar: 'كهرباء', en: 'Power', icon: 'zap' },
  ac: { ar: 'تكييف', en: 'AC', icon: 'thermometer' },
  kitchen: { ar: 'مطبخ', en: 'Kitchen', icon: 'utensils' },
  bathroom: { ar: 'حمام', en: 'Bathroom', icon: 'bath' },
  wifi: { ar: 'واي فاي', en: 'Wi-Fi', icon: 'wifi' },
  generator: { ar: 'مولد', en: 'Generator', icon: 'battery' },
  solar: { ar: 'طاقة شمسية', en: 'Solar', icon: 'sun' },
  tv: { ar: 'تلفزيون', en: 'TV', icon: 'tv' },
  awning: { ar: 'مظلة', en: 'Awning', icon: 'umbrella' },
} as const;

// Core constants
export const VAT_RATE = 0.15;
export const CURRENCY = 'SAR';
export const DEFAULT_LOCALE = 'ar';
export const BOOKING_NUMBER_PREFIX = 'KRF';
export const TICKET_NUMBER_PREFIX = 'TKT';
export const MAX_BOOKING_DAYS = 90;
export const MIN_BOOKING_DAYS = 1;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
export const SAUDI_PHONE_REGEX = /^\+966[0-9]{9}$/;
export const WEEKEND_DAYS = [5, 6] as const; // Friday = 5, Saturday = 6
