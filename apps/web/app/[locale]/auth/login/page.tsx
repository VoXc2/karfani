'use client';

import { useState } from 'react';
import { Compass, Phone, ArrowLeft, Shield, Lock } from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import { useAuth } from '../../../../hooks/useAuth';
import { api } from '../../../../lib/api';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const auth = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (phone.length < 9) {
      setError('الرجاء إدخال رقم جوال صحيح');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.sendOtp(phone);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('الرجاء إدخال رمز التحقق كاملاً');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await auth.login(phone, code);
      // Redirect on success
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex">
      {/* Left: Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-olive via-olive-dark to-charcoal items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 start-10 w-72 h-72 bg-sand/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 end-10 w-96 h-96 bg-copper/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative text-center px-12">
          <span className="text-[100px] block mb-8 animate-float">🏕️</span>
          <h2 className="text-4xl font-bold text-white mb-4">ابدأ مغامرتك</h2>
          <p className="text-xl text-white/60 leading-relaxed max-w-md mx-auto">
            سجل دخولك واستكشف أجمل الكرفانات والوجهات في المملكة
          </p>

          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-sand">+500</div>
              <div className="text-sm text-white/40 mt-1">كرفان</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-sand">13</div>
              <div className="text-sm text-white/40 mt-1">منطقة</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-sand">4.9</div>
              <div className="text-sm text-white/40 mt-1">تقييم</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-olive to-olive-dark rounded-xl flex items-center justify-center shadow-lg shadow-olive/25">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-olive">كرفاني</span>
            </Link>
          </div>

          {step === 'phone' ? (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-charcoal text-center mb-2">تسجيل الدخول</h1>
              <p className="text-charcoal-light text-center mb-8">أدخل رقم جوالك وراح نرسلك رمز تحقق</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">رقم الجوال</label>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-cream-dark text-sm font-medium text-charcoal-light shrink-0">
                      <span>🇸🇦</span>
                      <span dir="ltr">+966</span>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                      <input
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="5XXXXXXXX"
                        maxLength={9}
                        className="w-full ps-11 pe-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all text-left"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-olive to-olive-dark text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-olive/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري الإرسال...
                    </span>
                  ) : (
                    'إرسال رمز التحقق'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <button
                onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="flex items-center gap-2 text-olive mb-6 hover:gap-3 transition-all text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                تغيير الرقم
              </button>

              <h1 className="text-2xl font-bold text-charcoal text-center mb-2">أدخل رمز التحقق</h1>
              <p className="text-charcoal-light text-center mb-8">
                أرسلنا رمز التحقق إلى <span dir="ltr" className="font-semibold text-charcoal">+966{phone}</span>
              </p>

              {/* OTP Inputs */}
              <div className="flex items-center justify-center gap-3 mb-6" dir="ltr">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all bg-white"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-olive to-olive-dark text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-olive/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري التحقق...
                  </span>
                ) : (
                  'تأكيد'
                )}
              </button>

              <p className="text-center text-sm text-charcoal-light">
                لم يصلك الرمز؟{' '}
                <button className="text-olive font-medium hover:underline">إعادة الإرسال</button>
              </p>
            </div>
          )}

          {/* Trust */}
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-charcoal-light">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-olive" />
              <span>حماية PDPL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-olive" />
              <span>اتصال مشفر</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
