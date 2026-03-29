'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Calendar, MapPin, ArrowLeft, Star, Shield, Truck } from 'lucide-react';

const heroImages = [
  { emoji: '🏜️', gradient: 'from-amber-200/40 via-orange-100/30 to-olive/20' },
  { emoji: '⛺', gradient: 'from-olive/30 via-emerald-100/30 to-sand-light/40' },
  { emoji: '🌄', gradient: 'from-copper/20 via-sand-light/40 to-cream' },
];

const stats = [
  { value: '500+', label: 'كرفان متاح' },
  { value: '10K+', label: 'رحلة مكتملة' },
  { value: '4.9', label: 'تقييم العملاء' },
  { value: '13', label: 'منطقة' },
];

export default function HeroSection() {
  const t = useTranslations('hero');
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-20 min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${img.gradient} transition-opacity duration-1000 ${
              i === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Decorative Elements */}
        <div className="absolute top-20 start-10 w-72 h-72 bg-olive/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 end-10 w-96 h-96 bg-copper/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 start-1/3 w-64 h-64 bg-sand/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #2D2D2D 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-olive/10 border border-olive/20 rounded-full text-olive text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 bg-olive rounded-full animate-pulse" />
              المنصة الأولى لتأجير الكرفانات في السعودية
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-[1.15] animate-fade-in-up">
              {t('title')}
              <span className="block mt-2 bg-gradient-to-l from-olive via-olive-light to-copper bg-clip-text text-transparent">
                مع كرفاني
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-charcoal-light leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {t('subtitle')}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-olive">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-charcoal-light mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                <Shield className="w-4 h-4 text-olive" />
                <span>كرفانات موثقة</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                <Star className="w-4 h-4 text-copper" />
                <span>تقييمات حقيقية</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-charcoal-light">
                <Truck className="w-4 h-4 text-olive" />
                <span>توصيل لموقعك</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Main Card */}
              <div className="absolute inset-8 bg-white rounded-3xl shadow-2xl shadow-charcoal/10 overflow-hidden border border-cream-dark">
                <div className="h-3/5 bg-gradient-to-br from-olive/20 via-sand-light/50 to-copper/20 flex items-center justify-center">
                  <span className="text-[120px] animate-float">{heroImages[activeSlide]?.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-olive/10 text-olive text-xs rounded-full font-medium">مميز</span>
                    <div className="flex items-center gap-1 text-copper text-sm">
                      <Star className="w-3.5 h-3.5 fill-copper" />
                      <span className="font-semibold">4.9</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-charcoal text-lg">كرفان عائلي فاخر</h3>
                  <p className="text-charcoal-light text-sm mt-1">الرياض • ينام 6 أشخاص</p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-olive">1,200</span>
                    <span className="text-sm text-charcoal-light">ر.س / ليلة</span>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-4 end-0 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <p className="text-xs text-charcoal-light">تم تأكيد الحجز</p>
                  <p className="text-sm font-semibold text-charcoal">كرفان الرياض</p>
                </div>
              </div>

              <div className="absolute bottom-4 start-0 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-copper" />
                </div>
                <div>
                  <p className="text-xs text-charcoal-light">وجهة مقترحة</p>
                  <p className="text-sm font-semibold text-charcoal">وادي لجب، جازان</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`mt-12 lg:mt-16 max-w-4xl mx-auto transition-all duration-500 animate-fade-in-up ${
            searchFocused ? 'scale-[1.02]' : ''
          }`}
          style={{ animationDelay: '800ms' }}
        >
          <div className={`bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 ${
            searchFocused ? 'border-olive/30 shadow-2xl shadow-olive/10' : 'border-transparent'
          }`}>
            <div className="p-2 sm:p-3 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream/50 transition-colors cursor-pointer"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              >
                <MapPin className="w-5 h-5 text-olive shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-charcoal">{t('searchPlaceholder')}</label>
                  <input
                    type="text"
                    placeholder="الرياض، عسير، جدة..."
                    className="w-full text-sm text-charcoal-light outline-none bg-transparent mt-0.5"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>

              <div className="hidden sm:block w-px bg-cream-dark self-stretch my-2" />

              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream/50 transition-colors cursor-pointer">
                <Calendar className="w-5 h-5 text-olive shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-charcoal">{t('startDate')}</label>
                  <input
                    type="date"
                    className="w-full text-sm text-charcoal-light outline-none bg-transparent mt-0.5"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>

              <div className="hidden sm:block w-px bg-cream-dark self-stretch my-2" />

              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream/50 transition-colors cursor-pointer">
                <Calendar className="w-5 h-5 text-copper shrink-0" />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-charcoal">{t('endDate')}</label>
                  <input
                    type="date"
                    className="w-full text-sm text-charcoal-light outline-none bg-transparent mt-0.5"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
              </div>

              <button className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-copper to-copper-light text-white rounded-xl hover:shadow-lg hover:shadow-copper/30 transition-all duration-300 font-semibold hover:-translate-y-0.5 active:translate-y-0 shrink-0">
                <Search className="w-5 h-5" />
                <span>{t('searchButton')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
