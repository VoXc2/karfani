'use client';

import { Calendar, MapPin, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';

const statusConfig: Record<string, { label: string; color: string }> = {
  CONFIRMED: { label: 'مؤكد', color: 'bg-green-100 text-green-700' },
  PENDING_PAYMENT: { label: 'بانتظار الدفع', color: 'bg-yellow-100 text-yellow-700' },
  ACTIVE: { label: 'نشط', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'مكتمل', color: 'bg-charcoal/10 text-charcoal' },
  CANCELLED: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
  PREPARING: { label: 'قيد التجهيز', color: 'bg-olive/10 text-olive' },
};

const mockBookings = [
  { id: '1', bookingNumber: 'KRF-A1B2C3', caravan: 'كرفان الصحراء الفاخر', location: 'الرياض', startDate: '2026-04-10', endDate: '2026-04-13', status: 'CONFIRMED', total: '4,025 ر.س.' },
  { id: '2', bookingNumber: 'KRF-D4E5F6', caravan: 'كرفان المغامر', location: 'تبوك', startDate: '2026-03-01', endDate: '2026-03-04', status: 'COMPLETED', total: '2,415 ر.س.' },
  { id: '3', bookingNumber: 'KRF-G7H8I9', caravan: 'كرفان الشاطئ', location: 'أملج', startDate: '2026-02-15', endDate: '2026-02-17', status: 'CANCELLED', total: '1,104 ر.س.' },
];

export default function BookingsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-charcoal mb-8">حجوزاتي</h1>

          {mockBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-dark p-12 text-center">
              <Calendar className="w-12 h-12 text-charcoal-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-charcoal mb-2">لا توجد حجوزات</h2>
              <p className="text-charcoal-light mb-6">لم تقم بأي حجز بعد. استكشف الكرفانات المتاحة وابدأ مغامرتك!</p>
              <Link href="/caravans" className="inline-block bg-olive text-white px-6 py-3 rounded-xl font-medium hover:bg-olive-dark transition-all">
                استكشف الكرفانات
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {mockBookings.map((booking) => {
                const status = statusConfig[booking.status] ?? { label: booking.status, color: 'bg-gray-100 text-gray-700' };
                return (
                  <div key={booking.id} className="bg-white rounded-2xl border border-cream-dark p-6 hover:shadow-lg hover:border-olive/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-charcoal text-lg">{booking.caravan}</h3>
                        <p className="text-sm text-charcoal-light" dir="ltr">{booking.bookingNumber}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-charcoal-light mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {booking.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {booking.startDate} → {booking.endDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                      <p className="font-bold text-olive text-lg">{booking.total}</p>
                      <button className="flex items-center gap-1 text-sm text-olive hover:text-olive-dark transition-colors">
                        التفاصيل <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
