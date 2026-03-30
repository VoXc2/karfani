'use client';

import { Heart } from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import CaravanCard from '../../../../components/CaravanCard';
import { useFavorites } from '../../../../hooks/useFavorites';

const allCaravans = [
  { id: 1, title: 'كرفان عائلي فاخر', type: 'كرفان متنقل', location: 'الرياض', sleeps: 6, price: 1200, rating: 4.8, reviews: 124, image: '🏕️', amenities: ['wifi', 'ac', 'power'], featured: true },
  { id: 2, title: 'فان مغامرات الصحراء', type: 'فان مجهز', location: 'العلا', sleeps: 2, price: 700, rating: 4.9, reviews: 89, image: '🚐', amenities: ['wifi', 'heating'] },
  { id: 3, title: 'كرفان رحلات طويلة', type: 'مقطورة', location: 'عسير', sleeps: 4, price: 950, rating: 4.7, reviews: 67, image: '🏔️', amenities: ['ac', 'power', 'wifi'] },
  { id: 4, title: 'كرفان شاطئ البحر', type: 'كرفان متنقل', location: 'جدة', sleeps: 5, price: 1100, rating: 4.6, reviews: 45, image: '🏖️', amenities: ['wifi', 'ac'] },
  { id: 5, title: 'فان تخييم جبلي', type: 'فان مجهز', location: 'الباحة', sleeps: 3, price: 600, rating: 4.8, reviews: 56, image: '⛺', amenities: ['heating', 'power'] },
  { id: 6, title: 'كرفان فاخر VIP', type: 'كرفان فاخر', location: 'حائل', sleeps: 8, price: 2200, rating: 5.0, reviews: 31, image: '✨', amenities: ['wifi', 'ac', 'heating', 'power'], featured: true },
];

export default function FavoritesPage() {
  const { favorites, isFavorite } = useFavorites();

  const favoriteCaravans = allCaravans.filter((c) => isFavorite(String(c.id)));

  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-sand" />
            <h1 className="text-3xl font-bold text-white">المفضلة</h1>
          </div>
          <p className="text-white/60 mt-2">الكرفانات التي أعجبتك ({favorites.length})</p>
        </div>
      </div>

      <div className="min-h-[50vh] bg-cream py-12">
        <div className="container mx-auto px-4">
          {favoriteCaravans.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCaravans.map((caravan) => (
                <CaravanCard key={caravan.id} {...caravan} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-cream-dark">
                <Heart className="w-10 h-10 text-charcoal-light" />
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-3">لم تضف أي كرفان إلى المفضلة بعد</h2>
              <p className="text-charcoal-light mb-8 max-w-md">
                تصفح الكرفانات المتاحة واضغط على أيقونة القلب لإضافتها إلى قائمة المفضلة
              </p>
              <Link
                href={"/explore" as any}
                className="px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
              >
                تصفح الكرفانات
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
