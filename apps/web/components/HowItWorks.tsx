'use client';

import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Search, ClipboardCheck, Truck, ArrowDown } from 'lucide-react';

const steps = [
  { num: '١', icon: Search, color: 'olive' },
  { num: '٢', icon: ClipboardCheck, color: 'copper' },
  { num: '٣', icon: Truck, color: 'sand-dark' },
];

export default function HowItWorks() {
  const t = useTranslations('home');
  const { ref, visible } = useScrollAnimation();

  const stepData = [
    { title: t('step1Title'), desc: t('step1Desc') },
    { title: t('step2Title'), desc: t('step2Desc') },
    { title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-cream to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #4A5D3A 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`scroll-animate ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-copper/10 text-copper text-sm font-medium rounded-full mb-4">
              سهل وسريع
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-4">{t('howItWorks')}</h2>
            <p className="text-lg text-charcoal-light">ثلاث خطوات بسيطة لبدء مغامرتك</p>
          </div>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 lg:gap-12 stagger-children ${visible ? 'visible' : ''}`}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                {/* Connector line (between cards) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 start-full w-full h-0.5 bg-gradient-to-l from-cream-dark via-sand-light to-cream-dark -z-10" />
                )}

                <div className="bg-white rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-charcoal/5 transition-all duration-500 border border-cream-dark hover:border-olive/20 group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                    step.color === 'olive' ? 'bg-olive/10 text-olive group-hover:bg-olive group-hover:text-white' :
                    step.color === 'copper' ? 'bg-copper/10 text-copper group-hover:bg-copper group-hover:text-white' :
                    'bg-sand/30 text-sand-dark group-hover:bg-sand-dark group-hover:text-white'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Step number */}
                  <div className={`w-8 h-8 mx-auto mb-4 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    step.color === 'olive' ? 'bg-olive' :
                    step.color === 'copper' ? 'bg-copper' : 'bg-sand-dark'
                  }`}>
                    {step.num}
                  </div>

                  <h3 className="text-xl font-bold text-charcoal mb-3">{stepData[i]?.title}</h3>
                  <p className="text-charcoal-light leading-relaxed text-sm">{stepData[i]?.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
