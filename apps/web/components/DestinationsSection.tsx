'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Link } from '../i18n/navigation';

const destinations = [
  { name: 'العلا', region: 'المدينة المنورة', emoji: '🏜️', caravans: 42, color: 'from-amber-200/60 to-orange-100/40' },
  { name: 'عسير', region: 'المنطقة الجنوبية', emoji: '🏔️', caravans: 35, color: 'from-emerald-200/60 to-green-100/40' },
  { name: 'أملج', region: 'تبوك', emoji: '🏖️', caravans: 28, color: 'from-cyan-200/60 to-blue-100/40' },
  { name: 'الباحة', region: 'المنطقة الجنوبية', emoji: '⛰️', caravans: 22, color: 'from-olive/20 to-emerald-100/40' },
];

export default function DestinationsSection() {
  const { ref, visible } = useScrollAnimation();

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`scroll-animate ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-sand/30 text-sand-dark text-sm font-medium rounded-full mb-4">
              وجهات مميزة
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-4">اكتشف أجمل الوجهات</h2>
            <p className="text-lg text-charcoal-light">وجهات طبيعية مذهلة تنتظرك مع كرفاني</p>
          </div>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children ${visible ? 'visible' : ''}`}>
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-charcoal/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`h-72 bg-gradient-to-br ${dest.color} flex items-center justify-center`}>
                <span className="text-8xl group-hover:scale-125 transition-transform duration-700">{dest.emoji}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5">
                <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{dest.region}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                <p className="text-white/70 text-sm">{dest.caravans} كرفان متاح</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/routes"
            className="inline-flex items-center gap-2 text-olive font-semibold hover:gap-3 transition-all group"
          >
            استكشف جميع الوجهات
            <ArrowLeft className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
