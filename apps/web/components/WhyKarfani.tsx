'use client';

import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ShieldCheck, Star, Headphones, MapPin, CreditCard, Truck } from 'lucide-react';

const features = [
  { icon: ShieldCheck, color: 'olive', bg: 'olive/10' },
  { icon: Star, color: 'copper', bg: 'copper/10' },
  { icon: Headphones, color: 'sand-dark', bg: 'sand/20' },
  { icon: MapPin, color: 'olive', bg: 'olive/10' },
  { icon: CreditCard, color: 'copper', bg: 'copper/10' },
  { icon: Truck, color: 'sand-dark', bg: 'sand/20' },
];

const featureData = [
  { titleKey: 'verified', descKey: 'verifiedDesc' },
  { titleKey: 'protection', descKey: 'protectionDesc' },
  { titleKey: 'support247', descKey: 'support247Desc' },
];

const extraFeatures = [
  { title: 'مواقع مختارة', desc: 'وجهات ومسارات منتقاة بعناية في أجمل مناطق المملكة' },
  { title: 'دفع آمن', desc: 'مدى، Apple Pay، STC Pay — دفع سهل وآمن بدون بيانات بطاقة محفوظة' },
  { title: 'توصيل لموقعك', desc: 'نوصل الكرفان لموقعك أو لأي نقطة تحددها' },
];

export default function WhyKarfani() {
  const t = useTranslations('home');
  const { ref, visible } = useScrollAnimation();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 start-0 w-full h-full">
        <div className="absolute top-20 end-20 w-80 h-80 bg-olive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 start-20 w-64 h-64 bg-copper/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`scroll-animate ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-olive/10 text-olive text-sm font-medium rounded-full mb-4">
              لماذا نحن؟
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-4">{t('whyKarfani')}</h2>
            <p className="text-lg text-charcoal-light max-w-2xl mx-auto">تجربة لا مثيل لها من الحجز حتى العودة</p>
          </div>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children ${visible ? 'visible' : ''}`}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const fd = featureData[i];
            const ef = extraFeatures[i - 3];
            const data = i < 3 && fd ? { title: t(fd.titleKey), desc: t(fd.descKey) } : ef ?? { title: '', desc: '' };
            return (
              <div
                key={i}
                className="group bg-cream/50 border border-cream-dark rounded-2xl p-7 hover:bg-white hover:shadow-xl hover:shadow-charcoal/5 hover:border-olive/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 ${
                  f.color === 'olive' ? 'bg-olive/10 text-olive' :
                  f.color === 'copper' ? 'bg-copper/10 text-copper' :
                  'bg-sand/20 text-sand-dark'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-olive transition-colors">{data.title}</h3>
                <p className="text-charcoal-light text-sm leading-relaxed">{data.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
