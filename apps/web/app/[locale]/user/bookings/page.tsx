'use client';

import { CalendarDays, MapPin, ArrowRight, Clock, ChevronLeft } from 'lucide-react';
import { Link } from '../../../../i18n/navigation';

type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'active';

interface Booking {
  id: string;
  caravanName: string;
  location: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  total: number;
}

const statusConfig: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  confirmed: { label: 'مؤكد', bg: 'bg-green-100', text: 'text-green-700' },
  pending: { label: 'قيد الانتظار', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancelled: { label: 'ملغي', bg: 'bg-red-100', text: 'text-red-700' },
  active: { label: 'نشط', bg: 'bg-blue-100', text: 'text-blue-700' },
};

const bookings: Booking[] = [
  {
    id: 'BK-001',
    caravanName: 'كرفان الصحراء الذهبي',
    location: 'العلا، المدينة المنورة',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    status: 'confirmed',
    total: 2850,
  },
  {
    id: 'BK-002',
    caravanName: 'كرفان الشاطئ الفاخر',
    location: 'أملج، تبوك',
    startDate: '2026-05-01',
    endDate: '2026-05-04',
    status: 'pending',
    total: 3200,
  },
  {
    id: 'BK-003',
    caravanName: 'كرفان العائلة المريح',
    location: 'الطائف، مكة المكرمة',
    startDate: '2026-03-10',
    endDate: '2026-03-13',
    status: 'active',
    total: 1950,
  },
  {
    id: 'BK-004',
    caravanName: 'كرفان المغامرة',
    location: 'حائل',
    startDate: '2026-02-20',
    endDate: '2026-02-22',
    status: 'cancelled',
    total: 1500,
  },
];

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-white">حجوزاتي</h1>
          <p className="text-white/60 mt-2">تتبع جميع حجوزاتك في مكان واحد</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'الكل', count: bookings.length, active: true },
              { label: 'مؤكد', count: bookings.filter((b) => b.status === 'confirmed').length, active: false },
              { label: 'نشط', count: bookings.filter((b) => b.status === 'active').length, active: false },
              { label: 'قيد الانتظار', count: bookings.filter((b) => b.status === 'pending').length, active: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-4 text-center border transition-all cursor-pointer ${
                  stat.active
                    ? 'bg-olive text-white border-olive shadow-lg shadow-olive/25'
                    : 'bg-white text-charcoal border-cream-dark hover:border-olive/30'
                }`}
              >
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className={`text-sm mt-1 ${stat.active ? 'text-white/70' : 'text-charcoal-light'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Cards */}
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-charcoal">{booking.caravanName}</h3>
                        <div className="flex items-center gap-1.5 text-charcoal-light text-sm mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {booking.location}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-charcoal-light mb-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" />
                        <span dir="ltr">{booking.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span dir="ltr">{booking.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                      <div>
                        <span className="text-sm text-charcoal-light">الإجمالي</span>
                        <span className="text-lg font-bold text-olive ms-2">
                          {booking.total.toLocaleString()} ر.س
                        </span>
                      </div>
                      <button className="flex items-center gap-1.5 text-olive text-sm font-semibold hover:gap-2.5 transition-all">
                        تفاصيل الحجز
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state (shown when no bookings) */}
          {bookings.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="w-10 h-10 text-olive" />
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">لا توجد حجوزات</h3>
              <p className="text-charcoal-light mb-6">لم تقم بأي حجز بعد. ابدأ باستكشاف الكرفانات المتاحة.</p>
              <Link
                href="/caravans"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
              >
                تصفح الكرفانات
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
