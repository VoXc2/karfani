'use client';

import { useState } from 'react';
import { Calendar, Users, CreditCard, Shield, CheckCircle } from 'lucide-react';
import Navbar from '../../../components/Navbar';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('mada');
  const [agreed, setAgreed] = useState(false);

  const booking = {
    caravan: 'كرفان الصحراء الفاخر',
    location: 'الرياض',
    startDate: '2026-04-10',
    endDate: '2026-04-13',
    days: 3,
    guests: 4,
    basePrice: 2550,
    deliveryFee: 200,
    vat: 412.50,
    total: 3162.50,
    deposit: 2000,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-charcoal mb-8">إتمام الحجز</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Summary */}
              <div className="bg-white rounded-2xl border border-cream-dark p-6">
                <h2 className="text-lg font-bold text-charcoal mb-4">ملخص الحجز</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-charcoal-light">الكرفان</span>
                    <span className="font-medium text-charcoal">{booking.caravan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-light flex items-center gap-1"><MapPin className="w-4 h-4" /> الموقع</span>
                    <span className="font-medium text-charcoal">{booking.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-light flex items-center gap-1"><Calendar className="w-4 h-4" /> التاريخ</span>
                    <span className="font-medium text-charcoal">{booking.startDate} → {booking.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-light flex items-center gap-1"><Users className="w-4 h-4" /> الأشخاص</span>
                    <span className="font-medium text-charcoal">{booking.guests}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-cream-dark p-6">
                <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-olive" /> طريقة الدفع
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'mada', label: 'مدى', desc: 'بطاقة مدى البنكية' },
                    { id: 'visa', label: 'فيزا / ماستركارد', desc: 'بطاقة ائتمانية' },
                    { id: 'apple', label: 'Apple Pay', desc: 'الدفع عبر Apple Pay' },
                    { id: 'bank', label: 'تحويل بنكي', desc: 'تحويل مباشر' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-olive bg-olive/5' : 'border-cream-dark hover:border-olive/30'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-olive"
                      />
                      <div>
                        <p className="font-medium text-charcoal">{method.label}</p>
                        <p className="text-sm text-charcoal-light">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="accent-olive mt-1" />
                <span className="text-sm text-charcoal-light">
                  أوافق على <a href="/terms" className="text-olive underline">الشروط والأحكام</a> و<a href="/privacy" className="text-olive underline">سياسة الخصوصية</a>
                </span>
              </label>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-cream-dark p-6 sticky top-24">
                <h2 className="text-lg font-bold text-charcoal mb-4">التفاصيل المالية</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal-light">السعر الأساسي ({booking.days} أيام)</span>
                    <span>{booking.basePrice.toLocaleString()} ر.س.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-light">التوصيل</span>
                    <span>{booking.deliveryFee.toLocaleString()} ر.س.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-light">ضريبة القيمة المضافة (15%)</span>
                    <span>{booking.vat.toLocaleString()} ر.س.</span>
                  </div>
                  <div className="border-t border-cream-dark pt-3 flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span className="text-olive">{booking.total.toLocaleString()} ر.س.</span>
                  </div>
                  <div className="flex justify-between text-charcoal-light">
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> وديعة التأمين</span>
                    <span>{booking.deposit.toLocaleString()} ر.س.</span>
                  </div>
                </div>

                <button
                  disabled={!agreed}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-olive text-white hover:bg-olive-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" /> تأكيد الدفع
                </button>
                <p className="text-xs text-charcoal-light text-center mt-3">دفعك محمي ومشفر بالكامل</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}
