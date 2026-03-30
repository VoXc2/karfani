'use client';

import { useState } from 'react';
import { use } from 'react';
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Users,
  Clock,
  CheckCircle,
  Circle,
  Phone,
  MessageSquare,
  Star,
  XCircle,
  Truck,
  Package,
  PlayCircle,
  Flag,
} from 'lucide-react';
import { Link } from '../../../../../i18n/navigation';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';

type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'DISPATCHED'
  | 'HANDED_OVER'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

interface TimelineStep {
  status: BookingStatus;
  label: string;
  date: string | null;
  icon: React.ReactNode;
}

const mockBooking = {
  id: 'BK-2025-1042',
  status: 'ACTIVE' as BookingStatus,
  caravan: {
    id: 3,
    title: 'كرفان رحلات طويلة',
    type: 'مقطورة',
    location: 'عسير',
    sleeps: 4,
    image: '🏔️',
    rating: 4.7,
    reviews: 67,
  },
  dates: {
    start: '2025-12-20',
    end: '2025-12-25',
  },
  guests: 3,
  location: 'منتزه السودة، عسير',
  pricing: {
    dailyRate: 950,
    nights: 5,
    addons: 150,
    deliveryFee: 200,
    subtotal: 5100,
    vat: 765,
    total: 5865,
  },
  addons: ['كراسي خارجية', 'شواية'],
  timeline: [
    { status: 'PENDING' as BookingStatus, date: '2025-12-10 14:30' },
    { status: 'CONFIRMED' as BookingStatus, date: '2025-12-10 15:45' },
    { status: 'PREPARING' as BookingStatus, date: '2025-12-19 09:00' },
    { status: 'DISPATCHED' as BookingStatus, date: '2025-12-20 07:30' },
    { status: 'HANDED_OVER' as BookingStatus, date: '2025-12-20 10:00' },
    { status: 'ACTIVE' as BookingStatus, date: '2025-12-20 10:00' },
    { status: 'COMPLETED' as BookingStatus, date: null },
  ],
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'بانتظار التأكيد',
  CONFIRMED: 'مؤكد',
  PREPARING: 'جاري التجهيز',
  DISPATCHED: 'في الطريق',
  HANDED_OVER: 'تم التسليم',
  ACTIVE: 'نشط',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
};

const statusIcons: Record<BookingStatus, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  CONFIRMED: <CheckCircle className="w-4 h-4" />,
  PREPARING: <Package className="w-4 h-4" />,
  DISPATCHED: <Truck className="w-4 h-4" />,
  HANDED_OVER: <PlayCircle className="w-4 h-4" />,
  ACTIVE: <PlayCircle className="w-4 h-4" />,
  COMPLETED: <Flag className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
};

const statusBadgeColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-olive/10 text-olive',
  PREPARING: 'bg-blue-100 text-blue-700',
  DISPATCHED: 'bg-blue-100 text-blue-700',
  HANDED_OVER: 'bg-olive/10 text-olive',
  ACTIVE: 'bg-copper/10 text-copper',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const booking = mockBooking;

  const currentStatusIndex = booking.timeline.findIndex(
    (step) => step.status === booking.status
  );

  const isCancellable = ['PENDING', 'CONFIRMED'].includes(booking.status);
  const isCompleted = booking.status === 'COMPLETED';

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-16">
        <div className="container mx-auto px-4">
          <Link
            href={"/user/bookings" as any}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة لحجوزاتي
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-bold text-white">تفاصيل الحجز</h1>
            <span className="px-3 py-1 bg-white/10 text-white/80 text-sm font-medium rounded-full">
              {booking.id}
            </span>
            <span
              className={`px-3 py-1.5 text-xs font-bold rounded-full ${statusBadgeColors[booking.status]}`}
            >
              {statusLabels[booking.status]}
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-[60vh] bg-cream py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-6">حالة الحجز</h2>

              <div className="relative">
                {booking.timeline.map((step, index) => {
                  const isPast = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-4 relative">
                      {/* Vertical line */}
                      {index < booking.timeline.length - 1 && (
                        <div
                          className={`absolute start-[15px] top-8 w-0.5 h-full ${
                            index < currentStatusIndex ? 'bg-olive' : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Circle */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-olive text-white ring-4 ring-olive/20'
                            : isPast
                              ? 'bg-olive text-white'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isPast ? (
                          statusIcons[step.status]
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-8 flex-1">
                        <p
                          className={`font-semibold text-sm ${
                            isCurrent
                              ? 'text-olive'
                              : isPast
                                ? 'text-charcoal'
                                : 'text-gray-400'
                          }`}
                        >
                          {statusLabels[step.status]}
                        </p>
                        <p className="text-xs text-charcoal-light mt-0.5">
                          {formatDate(step.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-6">ملخص الحجز</h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-olive" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light">تاريخ الاستلام</p>
                    <p className="font-semibold text-charcoal">{booking.dates.start}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light">تاريخ التسليم</p>
                    <p className="font-semibold text-charcoal">{booking.dates.end}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-olive" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light">عدد الضيوف</p>
                    <p className="font-semibold text-charcoal">{booking.guests} أشخاص</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-olive" />
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light">الموقع</p>
                    <p className="font-semibold text-charcoal">{booking.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-6">تفاصيل السعر</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light text-sm">
                    السعر اليومي ({booking.pricing.dailyRate.toLocaleString()} ر.س) x{' '}
                    {booking.pricing.nights} ليالي
                  </span>
                  <span className="font-semibold text-charcoal">
                    {(booking.pricing.dailyRate * booking.pricing.nights).toLocaleString()} ر.س
                  </span>
                </div>

                {booking.pricing.addons > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-light text-sm">
                      إضافات ({booking.addons.join('، ')})
                    </span>
                    <span className="font-semibold text-charcoal">
                      {booking.pricing.addons.toLocaleString()} ر.س
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light text-sm">رسوم التوصيل</span>
                  <span className="font-semibold text-charcoal">
                    {booking.pricing.deliveryFee.toLocaleString()} ر.س
                  </span>
                </div>

                <div className="border-t border-cream-dark my-2" />

                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light text-sm">المجموع الفرعي</span>
                  <span className="font-semibold text-charcoal">
                    {booking.pricing.subtotal.toLocaleString()} ر.س
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light text-sm">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-semibold text-charcoal">
                    {booking.pricing.vat.toLocaleString()} ر.س
                  </span>
                </div>

                <div className="border-t border-cream-dark my-2" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-charcoal">الإجمالي</span>
                  <span className="text-lg font-bold text-olive">
                    {booking.pricing.total.toLocaleString()} ر.س
                  </span>
                </div>
              </div>
            </div>

            {/* Caravan Details */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-6">تفاصيل الكرفان</h2>

              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-sand-light to-olive/20 rounded-2xl flex items-center justify-center text-4xl shrink-0">
                  {booking.caravan.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-charcoal">{booking.caravan.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-charcoal-light flex-wrap">
                    <span className="px-2 py-0.5 bg-cream rounded-lg text-xs">
                      {booking.caravan.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.caravan.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {booking.caravan.sleeps} أشخاص
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-copper text-copper" />
                      {booking.caravan.rating} ({booking.caravan.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-6">الإجراءات</h2>

              <div className="flex flex-wrap gap-3">
                {isCancellable && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    إلغاء الحجز
                  </button>
                )}

                <button className="flex items-center gap-2 px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-cream transition-all">
                  <Phone className="w-4 h-4" />
                  تواصل مع الدعم
                </button>

                {isCompleted && (
                  <Link
                    href={`/caravans/${booking.caravan.id}` as any}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
                  >
                    <Star className="w-4 h-4" />
                    أضف تقييم
                  </Link>
                )}

                <button className="flex items-center gap-2 px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-cream transition-all">
                  <MessageSquare className="w-4 h-4" />
                  محادثة المالك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-charcoal text-center mb-2">إلغاء الحجز</h3>
            <p className="text-charcoal-light text-center mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ سيتم تطبيق سياسة الإلغاء واسترداد المبلغ
              وفقاً للشروط المعتمدة.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-cream transition-all"
              >
                تراجع
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  // Mock cancel action
                }}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors"
              >
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
