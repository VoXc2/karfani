'use client';

import { useState } from 'react';
import TopBar from '../../components/TopBar';
import {
  Search, Plus, Eye, Edit, MoreHorizontal, MapPin, Users, Star,
  CheckCircle, AlertTriangle, XCircle, Truck, Filter
} from 'lucide-react';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'نشط', bg: 'bg-olive/10', text: 'text-olive' },
  maintenance: { label: 'صيانة', bg: 'bg-copper/10', text: 'text-copper' },
  pending: { label: 'بانتظار الموافقة', bg: 'bg-sand/20', text: 'text-sand-dark' },
  inactive: { label: 'غير نشط', bg: 'bg-gray-100', text: 'text-gray-500' },
};

const caravans = [
  { id: 'C-001', title: 'كرفان عائلي فاخر', type: 'كرفان متنقل', owner: 'عبدالله المهندس', location: 'الرياض', sleeps: 6, price: 1200, rating: 4.8, reviews: 124, bookings: 45, status: 'active', revenue: 54000, image: '🏕️' },
  { id: 'C-003', title: 'كرفان فاخر VIP', type: 'كرفان فاخر', owner: 'محمد الراشد', location: 'حائل', sleeps: 8, price: 2200, rating: 5.0, reviews: 31, bookings: 28, status: 'active', revenue: 61600, image: '✨' },
  { id: 'C-008', title: 'كرفان رحلات طويلة', type: 'مقطورة', owner: 'سعد القرني', location: 'عسير', sleeps: 4, price: 950, rating: 4.7, reviews: 67, bookings: 38, status: 'active', revenue: 36100, image: '🏔️' },
  { id: 'C-012', title: 'فان مغامرات الصحراء', type: 'فان مجهز', owner: 'فيصل العمري', location: 'العلا', sleeps: 2, price: 700, rating: 4.9, reviews: 89, bookings: 52, status: 'maintenance', revenue: 36400, image: '🚐' },
  { id: 'C-015', title: 'فان تخييم جبلي', type: 'فان مجهز', owner: 'أحمد الغامدي', location: 'الباحة', sleeps: 3, price: 600, rating: 4.8, reviews: 56, bookings: 34, status: 'active', revenue: 20400, image: '⛺' },
  { id: 'C-023', title: 'كرفان شاطئ البحر', type: 'كرفان متنقل', owner: 'ياسر الزهراني', location: 'جدة', sleeps: 5, price: 1100, rating: 4.6, reviews: 45, bookings: 31, status: 'inactive', revenue: 34100, image: '🏖️' },
  { id: 'C-027', title: 'كرفان النجوم', type: 'كرفان متنقل', owner: 'تركي المالكي', location: 'تبوك', sleeps: 4, price: 1350, rating: 4.7, reviews: 42, bookings: 25, status: 'pending', revenue: 0, image: '🌟' },
  { id: 'C-031', title: 'كرفان الأحلام', type: 'كرفان فاخر', owner: 'ناصر الشمري', location: 'أملج', sleeps: 6, price: 1800, rating: 4.9, reviews: 36, bookings: 22, status: 'active', revenue: 39600, image: '🌊' },
];

export default function CaravansPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = caravans.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.title.includes(search) && !c.id.includes(search) && !c.owner.includes(search)) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <TopBar title="إدارة الكرفانات" />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{caravans.filter(c => c.status === 'active').length}</p>
                <p className="text-xs text-charcoal-light">كرفان نشط</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-copper" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{caravans.filter(c => c.status === 'maintenance').length}</p>
                <p className="text-xs text-charcoal-light">تحت الصيانة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sand/20 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-sand-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{caravans.filter(c => c.status === 'pending').length}</p>
                <p className="text-xs text-charcoal-light">بانتظار الموافقة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{(caravans.reduce((a, c) => a + c.rating, 0) / caravans.length).toFixed(1)}</p>
                <p className="text-xs text-charcoal-light">متوسط التقييم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-cream-dark p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم، المعرف، أو المالك..."
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-cream-dark text-sm focus:border-olive outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-cream-dark text-sm font-medium focus:border-olive outline-none cursor-pointer"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="maintenance">صيانة</option>
                <option value="pending">بانتظار الموافقة</option>
                <option value="inactive">غير نشط</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-olive text-white rounded-xl text-sm font-medium hover:bg-olive-dark transition-colors">
                <Plus className="w-4 h-4" />
                إضافة كرفان
              </button>
            </div>
          </div>
        </div>

        {/* Caravans Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((c) => {
            const status = statusConfig[c.status] || statusConfig.active;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-cream-dark overflow-hidden hover:shadow-lg hover:shadow-charcoal/5 transition-all group">
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-sand-light/50 to-olive/10 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{c.image}</span>
                  <div className="absolute top-3 start-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="absolute top-3 end-3 text-xs font-mono bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-charcoal-light">
                    {c.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-charcoal text-sm mb-1 group-hover:text-olive transition-colors">{c.title}</h3>
                  <p className="text-xs text-charcoal-light mb-3">{c.type} • {c.owner}</p>

                  <div className="flex items-center gap-3 text-xs text-charcoal-light mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {c.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {c.sleeps} أشخاص
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-copper text-copper" />
                      {c.rating}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 bg-cream/50 rounded-xl text-center mb-3">
                    <div>
                      <p className="text-xs text-charcoal-light">السعر</p>
                      <p className="text-sm font-bold text-charcoal">{c.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-light">الحجوزات</p>
                      <p className="text-sm font-bold text-olive">{c.bookings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-charcoal-light">الإيرادات</p>
                      <p className="text-sm font-bold text-charcoal">{(c.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-olive text-olive rounded-xl text-xs font-medium hover:bg-olive hover:text-white transition-all">
                      <Eye className="w-3.5 h-3.5" />
                      عرض
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-cream-dark text-charcoal-light rounded-xl text-xs font-medium hover:bg-cream transition-all">
                      <Edit className="w-3.5 h-3.5" />
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
