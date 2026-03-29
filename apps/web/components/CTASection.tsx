'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Link } from '../i18n/navigation';
import { ArrowLeft, Compass } from 'lucide-react';

export default function CTASection() {
  const { ref, visible } = useScrollAnimation();

  return (
    <section className="py-24 bg-gradient-to-br from-olive via-olive-dark to-charcoal relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-10 start-10 w-64 h-64 bg-sand/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 end-10 w-80 h-80 bg-copper/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div ref={ref} className={`relative max-w-4xl mx-auto px-4 text-center scroll-animate ${visible ? 'visible' : ''}`}>
        <div className="w-16 h-16 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center">
          <Compass className="w-8 h-8 text-sand" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          جاهز لمغامرتك القادمة؟
        </h2>
        <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          انضم لآلاف المغامرين واحجز كرفانك اليوم. تجربة فريدة تنتظرك في أجمل مناطق المملكة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/caravans"
            className="flex items-center gap-2 px-8 py-4 bg-copper text-white rounded-xl hover:bg-copper-light transition-all duration-300 font-semibold text-lg shadow-xl shadow-copper/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-copper/40 group"
          >
            ابدأ البحث الآن
            <ArrowLeft className="w-5 h-5 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="tel:+966500000000"
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-lg"
          >
            تواصل معنا
          </a>
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
          <div>
            <div className="text-3xl font-bold text-sand">+500</div>
            <div className="text-sm text-white/50 mt-1">كرفان متاح</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-sand">+10K</div>
            <div className="text-sm text-white/50 mt-1">رحلة ناجحة</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-sand">13</div>
            <div className="text-sm text-white/50 mt-1">منطقة مغطاة</div>
          </div>
        </div>
      </div>
    </section>
  );
}
