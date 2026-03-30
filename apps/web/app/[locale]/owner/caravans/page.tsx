'use client';

import {
  ArrowRight,
  Plus,
  Star,
  CalendarDays,
  Edit,
  Eye,
  Truck,
  ChevronLeft,
} from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

type CaravanStatus = 'active' | 'maintenance' | 'draft';

interface OwnerCaravan {
  id: string;
  title: string;
  type: string;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  bookingsCount: number;
  status: CaravanStatus;
  image: string;
}

const statusConfig: Record<CaravanStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'نشط', bg: 'bg-olive/10', text: 'text-olive' },
  maintenance: { label: 'صيانة', bg: 'bg-amber-100', text: 'text-amber-700' },
  draft: { label: 'مسودة', bg: 'bg-gray-100', text: 'text-gray-600' },
};

const caravans: OwnerCaravan[] = [
  {
    id: '1',
    title: 'كرفان الصحراء الذهبي',
    type: 'كرفان متنقل',
    pricePerDay: 950,
    rating: 4.9,
    reviewCount: 24,
    bookingsCount: 18,
    status: 'active',
    image: '/images/caravan-1.jpg',
  },
  {
    id: '2',
    title: 'كرفان الشاطئ الفاخر',
    type: 'مقطورة',
    pricePerDay: 1100,
    rating: 4.7,
    reviewCount: 16,
    bookingsCount: 12,
    status: 'active',
    image: '/images/caravan-2.jpg',
  },
  {
    id: '3',
    title: 'كرفان العائلة المريح',
    type: 'فان مجهز',
    pricePerDay: 650,
    rating: 4.5,
    reviewCount: 8,
    bookingsCount: 6,
    status: 'maintenance',
    image: '/images/caravan-3.jpg',
  },
  {
    id: '4',
    title: 'كرفان المغامرة الجديد',
    type: 'كرفان قابل للطي',
    pricePerDay: 500,
    rating: 0,
    reviewCount: 0,
    bookingsCount: 0,
    status: 'draft',
    image: '/images/caravan-4.jpg',
  },
];

export default function OwnerCaravansPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Link
            href={'/owner' as any}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للوحة التحكم
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">كرفاناتي</h1>
              <p className="text-white/60 mt-2">إدارة جميع كرفاناتك المسجلة</p>
            </div>
            <Link
              href={'/owner/caravans/new' as any}
              className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive-light to-olive text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all border border-white/20"
            >
              <Plus className="w-5 h-5" />
              إضافة كرفان جديد
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Mobile add button */}
        <Link
          href={'/owner/caravans/new' as any}
          className="sm:hidden flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold mb-6 hover:shadow-lg hover:shadow-olive/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          إضافة كرفان جديد
        </Link>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-cream-dark shadow-sm text-center">
            <div className="text-2xl font-bold text-olive">{caravans.filter((c) => c.status === 'active').length}</div>
            <div className="text-sm text-charcoal-light mt-1">نشط</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-cream-dark shadow-sm text-center">
            <div className="text-2xl font-bold text-amber-600">{caravans.filter((c) => c.status === 'maintenance').length}</div>
            <div className="text-sm text-charcoal-light mt-1">صيانة</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-cream-dark shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-500">{caravans.filter((c) => c.status === 'draft').length}</div>
            <div className="text-sm text-charcoal-light mt-1">مسودة</div>
          </div>
        </div>

        {/* Caravans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caravans.map((caravan) => {
            const status = statusConfig[caravan.status];
            return (
              <div
                key={caravan.id}
                className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-cream-dark to-sand-light flex items-center justify-center relative">
                  <Truck className="w-16 h-16 text-sand" />
                  <span className={`absolute top-4 end-4 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-charcoal mb-1">{caravan.title}</h3>
                  <p className="text-sm text-charcoal-light mb-3">{caravan.type}</p>

                  <div className="flex items-center gap-4 text-sm text-charcoal-light mb-4">
                    {caravan.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium text-charcoal">{caravan.rating}</span>
                        <span>({caravan.reviewCount})</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{caravan.bookingsCount} حجز</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                    <div>
                      <span className="text-lg font-bold text-olive">{caravan.pricePerDay.toLocaleString()}</span>
                      <span className="text-sm text-charcoal-light ms-1">ر.س / يوم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 rounded-xl border border-cream-dark flex items-center justify-center text-charcoal-light hover:bg-cream hover:text-olive transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-xl border border-cream-dark flex items-center justify-center text-charcoal-light hover:bg-cream hover:text-olive transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link
                        href={'/owner/calendar' as any}
                        className="w-9 h-9 rounded-xl border border-cream-dark flex items-center justify-center text-charcoal-light hover:bg-cream hover:text-olive transition-colors"
                      >
                        <CalendarDays className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
