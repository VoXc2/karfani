'use client';

import { useState } from 'react';
import {
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  User,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
  Truck,
} from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'rejected';

interface OwnerBooking {
  id: string;
  customer: string;
  customerPhone: string;
  caravan: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  total: number;
  days: number;
}

const statusConfig: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'بانتظار الموافقة', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  confirmed: { label: 'مؤكد', bg: 'bg-green-100', text: 'text-green-700' },
  active: { label: 'نشط', bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { label: 'مكتمل', bg: 'bg-olive/10', text: 'text-olive' },
  rejected: { label: 'مرفوض', bg: 'bg-red-100', text: 'text-red-700' },
};

type FilterKey = 'all' | 'pending' | 'confirmed' | 'active' | 'completed';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'بانتظار الموافقة' },
  { key: 'confirmed', label: 'مؤكد' },
  { key: 'active', label: 'نشط' },
  { key: 'completed', label: 'مكتمل' },
];

const mockBookings: OwnerBooking[] = [
  {
    id: 'BK-201',
    customer: 'محمد العتيبي',
    customerPhone: '0512345678',
    caravan: 'كرفان الصحراء الذهبي',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    status: 'pending',
    total: 2850,
    days: 3,
  },
  {
    id: 'BK-202',
    customer: 'خالد الشمري',
    customerPhone: '0551234567',
    caravan: 'كرفان الشاطئ الفاخر',
    startDate: '2026-04-20',
    endDate: '2026-04-23',
    status: 'pending',
    total: 2400,
    days: 3,
  },
  {
    id: 'BK-203',
    customer: 'سارة الأحمد',
    customerPhone: '0567891234',
    caravan: 'كرفان العائلة المريح',
    startDate: '2026-03-28',
    endDate: '2026-03-31',
    status: 'active',
    total: 1950,
    days: 3,
  },
  {
    id: 'BK-204',
    customer: 'فيصل القحطاني',
    customerPhone: '0598765432',
    caravan: 'كرفان الصحراء الذهبي',
    startDate: '2026-05-01',
    endDate: '2026-05-04',
    status: 'confirmed',
    total: 2850,
    days: 3,
  },
  {
    id: 'BK-205',
    customer: 'نورة العنزي',
    customerPhone: '0534567890',
    caravan: 'كرفان الشاطئ الفاخر',
    startDate: '2026-02-10',
    endDate: '2026-02-14',
    status: 'completed',
    total: 3200,
    days: 4,
  },
  {
    id: 'BK-206',
    customer: 'عبدالله الدوسري',
    customerPhone: '0543216789',
    caravan: 'كرفان العائلة المريح',
    startDate: '2026-01-20',
    endDate: '2026-01-22',
    status: 'completed',
    total: 1300,
    days: 2,
  },
];

export default function OwnerBookingsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered =
    activeFilter === 'all'
      ? mockBookings
      : mockBookings.filter((b) => b.status === activeFilter);

  const handleAccept = (id: string) => {
    alert(`تم قبول الحجز ${id}`);
  };

  const handleReject = (id: string) => {
    alert(`تم رفض الحجز ${id}`);
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Link
            href="/owner"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-white">حجوزات كرفاناتي</h1>
          <p className="text-white/60 mt-2">إدارة الحجوزات الواردة على كرفاناتك</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto hide-scrollbar pb-1">
            {filters.map((f) => {
              const count =
                f.key === 'all'
                  ? mockBookings.length
                  : mockBookings.filter((b) => b.status === f.key).length;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeFilter === f.key
                      ? 'bg-olive text-white shadow-lg shadow-olive/25'
                      : 'bg-white text-charcoal border border-cream-dark hover:border-olive/30'
                  }`}
                >
                  {f.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === f.key ? 'bg-white/20' : 'bg-cream-dark'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filtered.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-copper" />
                        </div>
                        <div>
                          <h3 className="font-bold text-charcoal">{booking.customer}</h3>
                          <p className="text-sm text-charcoal-light mt-0.5 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                            {booking.caravan}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-charcoal-light mb-4">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" />
                        <span dir="ltr">
                          {booking.startDate} - {booking.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{booking.days} أيام</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                      <div>
                        <span className="text-sm text-charcoal-light">الإجمالي</span>
                        <span className="text-lg font-bold text-olive ms-2">
                          {booking.total.toLocaleString()} ر.س
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(booking.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              قبول
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              رفض
                            </button>
                          </>
                        )}
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-cream-dark text-charcoal rounded-xl text-sm font-semibold hover:bg-cream transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          تواصل
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarDays className="w-10 h-10 text-olive" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">لا توجد حجوزات</h3>
                <p className="text-charcoal-light">لا توجد حجوزات بهذه الحالة حاليا.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
