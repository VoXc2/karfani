'use client';

import { useState } from 'react';
import { CreditCard, Building2, CalendarDays, MapPin, Users, Shield, Check, ArrowRight } from 'lucide-react';
import { Link } from '../../../i18n/navigation';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'bank'>('mada');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const booking = {
    caravanName: 'كرفان الصحراء الذهبي',
    location: 'العلا، المدينة المنورة',
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    nights: 3,
    guests: 4,
    basePrice: 750,
    deliveryFee: 200,
    addons: 150,
    deposit: 500,
  };

  const subtotal = booking.basePrice * booking.nights + booking.deliveryFee + booking.addons;
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + vat;

  const handleConfirm = () => {
    if (!agreed) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-12">
        <div className="container mx-auto px-4">
          <Link href="/caravans" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للكرفانات
          </Link>
          <h1 className="text-3xl font-bold text-white">إتمام الحجز</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Booking Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-4">تفاصيل الحجز</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-olive/10 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-3xl">🚐</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal">{booking.caravanName}</h3>
                    <div className="flex items-center gap-1.5 text-charcoal-light text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.location}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-cream-dark">
                  <div className="text-center">
                    <CalendarDays className="w-5 h-5 text-olive mx-auto mb-1" />
                    <div className="text-xs text-charcoal-light">تاريخ الاستلام</div>
                    <div className="text-sm font-semibold text-charcoal mt-0.5" dir="ltr">{booking.startDate}</div>
                  </div>
                  <div className="text-center">
                    <CalendarDays className="w-5 h-5 text-olive mx-auto mb-1" />
                    <div className="text-xs text-charcoal-light">تاريخ الإعادة</div>
                    <div className="text-sm font-semibold text-charcoal mt-0.5" dir="ltr">{booking.endDate}</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-olive mx-auto mb-1" />
                    <div className="text-xs text-charcoal-light">عدد الأشخاص</div>
                    <div className="text-sm font-semibold text-charcoal mt-0.5">{booking.guests} أشخاص</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm">
              <h2 className="text-lg font-bold text-charcoal mb-4">طريقة الدفع</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'mada'
                      ? 'border-olive bg-olive/5'
                      : 'border-cream-dark hover:border-olive/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mada'}
                    onChange={() => setPaymentMethod('mada')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'mada' ? 'border-olive' : 'border-charcoal-light'
                  }`}>
                    {paymentMethod === 'mada' && <div className="w-2.5 h-2.5 bg-olive rounded-full" />}
                  </div>
                  <CreditCard className="w-6 h-6 text-olive" />
                  <div>
                    <div className="font-semibold text-charcoal">بطاقة مدى</div>
                    <div className="text-xs text-charcoal-light">ادفع مباشرة عبر بطاقة مدى</div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-olive bg-olive/5'
                      : 'border-cream-dark hover:border-olive/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'bank' ? 'border-olive' : 'border-charcoal-light'
                  }`}>
                    {paymentMethod === 'bank' && <div className="w-2.5 h-2.5 bg-olive rounded-full" />}
                  </div>
                  <Building2 className="w-6 h-6 text-olive" />
                  <div>
                    <div className="font-semibold text-charcoal">تحويل بنكي</div>
                    <div className="text-xs text-charcoal-light">تحويل إلى حساب كرفاني البنكي</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                    agreed ? 'bg-olive border-olive' : 'border-charcoal-light'
                  }`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-charcoal-light leading-relaxed" onClick={() => setAgreed(!agreed)}>
                  أوافق على{' '}
                  <Link href="/terms" className="text-olive font-semibold hover:underline">الشروط والأحكام</Link>
                  {' '}و{' '}
                  <Link href="/privacy" className="text-olive font-semibold hover:underline">سياسة الخصوصية</Link>
                  {' '}الخاصة بكرفاني وأتعهد بالالتزام بسياسة الإلغاء.
                </span>
              </label>
            </div>
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-charcoal mb-5">ملخص السعر</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal-light">
                    {booking.basePrice.toLocaleString()} ر.س x {booking.nights} ليالي
                  </span>
                  <span className="font-semibold text-charcoal">
                    {(booking.basePrice * booking.nights).toLocaleString()} ر.س
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-light">التوصيل</span>
                  <span className="font-semibold text-charcoal">{booking.deliveryFee.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-light">الإضافات</span>
                  <span className="font-semibold text-charcoal">{booking.addons.toLocaleString()} ر.س</span>
                </div>
                <div className="border-t border-cream-dark pt-3 flex justify-between">
                  <span className="text-charcoal-light">المجموع الفرعي</span>
                  <span className="font-semibold text-charcoal">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-light">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-semibold text-charcoal">{vat.toLocaleString()} ر.س</span>
                </div>
                <div className="border-t border-cream-dark pt-3 flex justify-between text-base">
                  <span className="font-bold text-charcoal">الإجمالي</span>
                  <span className="font-bold text-olive">{total.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-charcoal-light">مبلغ التأمين (يُسترد)</span>
                  <span className="text-charcoal-light">{booking.deposit.toLocaleString()} ر.س</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!agreed || processing}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-olive/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري المعالجة...
                  </span>
                ) : (
                  `تأكيد الدفع - ${total.toLocaleString()} ر.س`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-charcoal-light">
                <Shield className="w-3.5 h-3.5 text-olive" />
                <span>دفع آمن ومشفر</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
