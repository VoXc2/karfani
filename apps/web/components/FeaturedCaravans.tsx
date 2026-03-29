'use client';

import { useTranslations } from 'next-intl';
import CaravanCard from './CaravanCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowLeft } from 'lucide-react';
import { Link } from '../i18n/navigation';

const caravans = [
  { id: 1, title: 'كرفان عائلي فاخر', type: 'كرفان متنقل', location: 'الرياض', sleeps: 6, price: 1200, rating: 4.8, reviews: 124, image: '🏕️', amenities: ['wifi', 'ac', 'power'], featured: true },
  { id: 2, title: 'فان مغامرات الصحراء', type: 'فان مجهز', location: 'العلا', sleeps: 2, price: 700, rating: 4.9, reviews: 89, image: '🚐', amenities: ['wifi', 'heating'] },
  { id: 3, title: 'كرفان رحلات طويلة', type: 'مقطورة', location: 'عسير', sleeps: 4, price: 950, rating: 4.7, reviews: 67, image: '🏔️', amenities: ['ac', 'power', 'wifi'] },
  { id: 4, title: 'كرفان شاطئ البحر', type: 'كرفان متنقل', location: 'جدة', sleeps: 5, price: 1100, rating: 4.6, reviews: 45, image: '🏖️', amenities: ['wifi', 'ac'] },
  { id: 5, title: 'فان تخييم جبلي', type: 'فان مجهز', location: 'الباحة', sleeps: 3, price: 600, rating: 4.8, reviews: 56, image: '⛺', amenities: ['heating', 'power'] },
  { id: 6, title: 'كرفان فاخر VIP', type: 'كرفان فاخر', location: 'حائل', sleeps: 8, price: 2200, rating: 5.0, reviews: 31, image: '✨', amenities: ['wifi', 'ac', 'heating', 'power'], featured: true },
];

export default function FeaturedCaravans() {
  const t = useTranslations('home');
  const { ref, visible } = useScrollAnimation();

  return (
    <section className="py-24 bg-white" id="caravans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`scroll-animate ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-olive/10 text-olive text-sm font-medium rounded-full mb-4">
              الأكثر طلباً
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-4">{t('featuredTitle')}</h2>
            <p className="text-lg text-charcoal-light max-w-2xl mx-auto">{t('featuredSubtitle')}</p>
          </div>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children ${visible ? 'visible' : ''}`}>
          {caravans.map((c) => (
            <CaravanCard key={c.id} {...c} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/caravans"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-olive text-olive rounded-xl hover:bg-olive hover:text-white transition-all duration-300 font-semibold group"
          >
            عرض جميع الكرفانات
            <ArrowLeft className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
