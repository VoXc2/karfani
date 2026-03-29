'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CaravanCard from '../../../components/CaravanCard';
import { Search, SlidersHorizontal, X, MapPin, Users, ChevronDown } from 'lucide-react';

const allCaravans = [
  { id: 1, title: 'كرفان عائلي فاخر', type: 'كرفان متنقل', location: 'الرياض', sleeps: 6, price: 1200, rating: 4.8, reviews: 124, image: '🏕️', amenities: ['wifi', 'ac', 'power'], featured: true },
  { id: 2, title: 'فان مغامرات الصحراء', type: 'فان مجهز', location: 'العلا', sleeps: 2, price: 700, rating: 4.9, reviews: 89, image: '🚐', amenities: ['wifi', 'heating'] },
  { id: 3, title: 'كرفان رحلات طويلة', type: 'مقطورة', location: 'عسير', sleeps: 4, price: 950, rating: 4.7, reviews: 67, image: '🏔️', amenities: ['ac', 'power', 'wifi'] },
  { id: 4, title: 'كرفان شاطئ البحر', type: 'كرفان متنقل', location: 'جدة', sleeps: 5, price: 1100, rating: 4.6, reviews: 45, image: '🏖️', amenities: ['wifi', 'ac'] },
  { id: 5, title: 'فان تخييم جبلي', type: 'فان مجهز', location: 'الباحة', sleeps: 3, price: 600, rating: 4.8, reviews: 56, image: '⛺', amenities: ['heating', 'power'] },
  { id: 6, title: 'كرفان فاخر VIP', type: 'كرفان فاخر', location: 'حائل', sleeps: 8, price: 2200, rating: 5.0, reviews: 31, image: '✨', amenities: ['wifi', 'ac', 'heating', 'power'], featured: true },
  { id: 7, title: 'كرفان النجوم', type: 'كرفان متنقل', location: 'تبوك', sleeps: 4, price: 1350, rating: 4.7, reviews: 42, image: '🌟', amenities: ['wifi', 'ac', 'power'] },
  { id: 8, title: 'فان رحلات قصيرة', type: 'فان مجهز', location: 'الطائف', sleeps: 2, price: 500, rating: 4.5, reviews: 78, image: '🚌', amenities: ['wifi'] },
  { id: 9, title: 'كرفان الأحلام', type: 'كرفان فاخر', location: 'أملج', sleeps: 6, price: 1800, rating: 4.9, reviews: 36, image: '🌊', amenities: ['wifi', 'ac', 'heating', 'power'], featured: true },
];

const locations = ['الكل', 'الرياض', 'جدة', 'العلا', 'عسير', 'الباحة', 'حائل', 'تبوك', 'الطائف', 'أملج'];
const types = ['الكل', 'كرفان متنقل', 'فان مجهز', 'مقطورة', 'كرفان فاخر'];
const sortOptions = [
  { value: 'recommended', label: 'الأكثر ملاءمة' },
  { value: 'price-asc', label: 'السعر: الأقل أولاً' },
  { value: 'price-desc', label: 'السعر: الأعلى أولاً' },
  { value: 'rating', label: 'التقييم الأعلى' },
];

export default function CaravansPage() {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('الكل');
  const [selectedType, setSelectedType] = useState('الكل');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  let filtered = allCaravans.filter((c) => {
    if (search && !c.title.includes(search) && !c.location.includes(search)) return false;
    if (selectedLocation !== 'الكل' && c.location !== selectedLocation) return false;
    if (selectedType !== 'الكل' && c.type !== selectedType) return false;
    if (c.price < priceRange[0] || c.price > priceRange[1]) return false;
    return true;
  });

  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const activeFilters = [
    selectedLocation !== 'الكل' ? selectedLocation : null,
    selectedType !== 'الكل' ? selectedType : null,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-8 bg-gradient-to-b from-olive/5 to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">استكشف الكرفانات</h1>
          <p className="text-charcoal-light">اختر كرفانك المثالي من بين مجموعة متنوعة</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-dark p-4 mb-8 sticky top-20 z-30">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-light" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن كرفان أو موقع..."
                className="w-full ps-12 pe-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Location */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none px-4 py-3 pe-10 rounded-xl border border-cream-dark bg-white text-sm font-medium focus:border-olive outline-none cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc === 'الكل' ? 'جميع المواقع' : loc}</option>
                  ))}
                </select>
                <MapPin className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light pointer-events-none" />
              </div>

              {/* Type */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none px-4 py-3 pe-10 rounded-xl border border-cream-dark bg-white text-sm font-medium focus:border-olive outline-none cursor-pointer"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>{type === 'الكل' ? 'جميع الأنواع' : type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light pointer-events-none" />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pe-8 rounded-xl border border-cream-dark bg-white text-sm font-medium focus:border-olive outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Filters Toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  filtersOpen ? 'bg-olive text-white border-olive' : 'border-cream-dark hover:border-olive'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                فلاتر
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-cream-dark">
              <span className="text-xs text-charcoal-light">الفلاتر النشطة:</span>
              {activeFilters.map((filter) => (
                <span key={filter} className="flex items-center gap-1 px-3 py-1 bg-olive/10 text-olive text-xs rounded-full font-medium">
                  {filter}
                  <button onClick={() => {
                    if (filter === selectedLocation) setSelectedLocation('الكل');
                    if (filter === selectedType) setSelectedType('الكل');
                  }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setSelectedLocation('الكل'); setSelectedType('الكل'); setSearch(''); }}
                className="text-xs text-copper hover:underline"
              >
                مسح الكل
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-charcoal-light text-sm">
            عرض <span className="font-semibold text-charcoal">{filtered.length}</span> كرفان
          </p>
        </div>

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((c) => (
              <CaravanCard key={c.id} {...c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🏕️</span>
            <h3 className="text-xl font-bold text-charcoal mb-2">لا توجد نتائج</h3>
            <p className="text-charcoal-light mb-6">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
            <button
              onClick={() => { setSelectedLocation('الكل'); setSelectedType('الكل'); setSearch(''); }}
              className="px-6 py-3 bg-olive text-white rounded-xl font-medium hover:bg-olive-dark transition-colors"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
