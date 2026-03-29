'use client';

import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'أحمد الشهري',
    location: 'الرياض',
    avatar: '👨',
    rating: 5,
    text: 'تجربة ممتازة! الكرفان كان نظيف ومجهز بالكامل. سافرنا للعلا وكانت رحلة لا تُنسى. خدمة العملاء كانت متعاونة جداً.',
  },
  {
    name: 'نورة القحطاني',
    location: 'جدة',
    avatar: '👩',
    rating: 5,
    text: 'أول مرة أجرب الكرفان وكانت تجربة رائعة. التطبيق سهل والحجز كان سريع. بالتأكيد راح أحجز مرة ثانية!',
  },
  {
    name: 'فهد العتيبي',
    location: 'الدمام',
    avatar: '👨‍👩‍👧‍👦',
    rating: 5,
    text: 'رحلة عائلية مثالية! الأطفال استمتعوا كثير. الكرفان كان فيه كل اللي نحتاجه. شكراً كرفاني على هالتجربة الحلوة.',
  },
  {
    name: 'سارة المطيري',
    location: 'أبها',
    avatar: '👩',
    rating: 4,
    text: 'استأجرنا كرفان لرحلة الباحة. الطبيعة كانت خيالية والكرفان مريح. التوصيل كان في الوقت المحدد.',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useScrollAnimation();

  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`scroll-animate ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-copper/10 text-copper text-sm font-medium rounded-full mb-4">
              آراء عملائنا
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-4">ماذا يقول عملاؤنا؟</h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-charcoal/5 border border-cream-dark">
            <Quote className="absolute top-6 end-6 w-10 h-10 text-olive/10" />

            <div className="flex flex-col items-center text-center">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < (testimonials[active]?.rating ?? 0) ? 'fill-copper text-copper' : 'text-cream-dark'}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-lg md:text-xl text-charcoal leading-relaxed mb-8 max-w-2xl transition-all duration-500">
                "{testimonials[active]?.text}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">{testimonials[active]?.avatar}</span>
                <div>
                  <p className="font-bold text-charcoal">{testimonials[active]?.name}</p>
                  <p className="text-sm text-charcoal-light">{testimonials[active]?.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-white border border-cream-dark flex items-center justify-center hover:bg-olive hover:text-white hover:border-olive transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === active ? 'bg-olive w-8' : 'bg-cream-dark hover:bg-sand'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-white border border-cream-dark flex items-center justify-center hover:bg-olive hover:text-white hover:border-olive transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
