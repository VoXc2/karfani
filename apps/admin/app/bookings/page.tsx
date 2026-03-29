'use client';

import { useState } from 'react';
import TopBar from '../../components/TopBar';
import {
  Search, SlidersHorizontal, Download, Eye, MoreHorizontal,
  ChevronLeft, ChevronRight, Calendar, CheckCircle, Clock, XCircle, Truck
} from 'lucide-react';

type BookingStatus = 'all' | 'confirmed' | 'pending' | 'active' | 'completed' | 'cancelled';

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  confirmed: { label: 'مؤكد', bg: 'bg-olive/10', text: 'text-olive', icon: CheckCircle },
  pending: { label: 'بانتظار الدفع', bg: 'bg-copper/10', text: 'text-copper', icon: Clock },
  active: { label: 'نشط', bg: 'bg-blue-50', text: 'text-blue-600', icon: Truck },
  preparing: { label: 'تحت التجهيز', bg: 'bg-sand/20', text: 'text-sand-dark', icon: Clock },
  completed: { label: 'مكتمل', bg: 'bg-gray-100', text: 'text-gray-500', icon: CheckCircle },
  cancelled: { label: 'ملغي', bg: 'bg-red-50', text: 'text-red-500', icon: XCircle },
};

const bookings = [
  { id: 'KRF-2847', customer: 'أحمد الشهري', phone: '0501234567', caravan: 'كرفان عائلي فاخر', caravanId: 'C-001', start: '2026-03-15', end: '2026-03-20', status: 'confirmed', amount: 6000, paid: true },
  { id: 'KRF-2846', customer: 'نورة القحطاني', phone: '0559876543', caravan: 'فان مغامرات', caravanId: 'C-012', start: '2026-03-18', end: '2026-03-22', status: 'pending', amount: 2800, paid: false },
  { id: 'KRF-2845', customer: 'فهد العتيبي', phone: '0561112233', caravan: 'كرفان رحلات طويلة', caravanId: 'C-008', start: '2026-03-10', end: '2026-03-15', status: 'preparing', amount: 4750, paid: true },
  { id: 'KRF-2844', customer: 'سارة المطيري', phone: '0548887766', caravan: 'كرفان شاطئ البحر', caravanId: 'C-023', start: '2026-03-08', end: '2026-03-12', status: 'active', amount: 4400, paid: true },
  { id: 'KRF-2843', customer: 'خالد الدوسري', phone: '0533445566', caravan: 'فان تخييم جبلي', caravanId: 'C-015', start: '2026-03-05', end: '2026-03-08', status: 'completed', amount: 1800, paid: true },
  { id: 'KRF-2842', customer: 'ريم العنزي', phone: '0522334455', caravan: 'كرفان فاخر VIP', caravanId: 'C-003', start: '2026-03-01', end: '2026-03-07', status: 'completed', amount: 13200, paid: true },
  { id: 'KRF-2841', customer: 'محمد الحربي', phone: '0511223344', caravan: 'كرفان عائلي فاخر', caravanId: 'C-001', start: '2026-02-25', end: '2026-02-28', status: 'cancelled', amount: 3600, paid: false },
  { id: 'KRF-2840', customer: 'هند السبيعي', phone: '0566778899', caravan: 'فان مغامرات', caravanId: 'C-012', start: '2026-02-20', end: '2026-02-23', status: 'completed', amount: 2100, paid: true },
];

const statusTabs: { key: BookingStatus; label: string; count: number }[] = [
  { key: 'all', label: 'الكل', count: bookings.length },
  { key: 'confirmed', label: 'مؤكدة', count: bookings.filter(b => b.status === 'confirmed').length },
  { key: 'pending', label: 'بانتظار الدفع', count: bookings.filter(b => b.status === 'pending').length },
  { key: 'active', label: 'نشطة', count: bookings.filter(b => b.status === 'active').length },
  { key: 'completed', label: 'مكتملة', count: bookings.filter(b => b.status === 'completed').length },
  { key: 'cancelled', label: 'ملغاة', count: bookings.filter(b => b.status === 'cancelled').length },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    if (activeTab !== 'all' && b.status !== activeTab) return false;
    if (search && !b.id.includes(search) && !b.customer.includes(search) && !b.caravan.includes(search)) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <TopBar title="إدارة الحجوزات" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <p className="text-xs text-charcoal-light">إجمالي اليوم</p>
            <p className="text-2xl font-bold text-charcoal mt-1">12</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <p className="text-xs text-charcoal-light">بانتظار التأكيد</p>
            <p className="text-2xl font-bold text-copper mt-1">3</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <p className="text-xs text-charcoal-light">رحلات نشطة</p>
            <p className="text-2xl font-bold text-olive mt-1">8</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <p className="text-xs text-charcoal-light">إيرادات اليوم</p>
            <p className="text-2xl font-bold text-charcoal mt-1">18,500 <span className="text-sm font-normal text-charcoal-light">ر.س</span></p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-cream-dark overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-olive text-white'
                    : 'text-charcoal-light hover:bg-cream'
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-cream text-charcoal-light'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="px-5 py-3 flex items-center gap-3 border-b border-cream-dark">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث برقم الحجز، اسم العميل، أو الكرفان..."
                className="w-full ps-10 pe-4 py-2 rounded-lg border border-cream-dark text-sm focus:border-olive outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-cream-dark rounded-lg text-sm text-charcoal-light hover:bg-cream transition-colors">
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream/30">
                <tr>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">رقم الحجز</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">العميل</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">الكرفان</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">تاريخ الرحلة</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">الحالة</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">المبلغ</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light">الدفع</th>
                  <th className="text-start px-5 py-3 text-xs font-semibold text-charcoal-light"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {filtered.map((b) => {
                  const status = statusConfig[b.status] || statusConfig.confirmed;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={b.id} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-semibold text-olive text-sm">{b.id}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-charcoal">{b.customer}</p>
                        <p className="text-xs text-charcoal-light" dir="ltr">{b.phone}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-charcoal">{b.caravan}</p>
                        <p className="text-xs text-charcoal-light">{b.caravanId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm text-charcoal-light">
                          <Calendar className="w-3.5 h-3.5" />
                          <span dir="ltr">{b.start}</span>
                          <span>→</span>
                          <span dir="ltr">{b.end}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-charcoal">{b.amount.toLocaleString()} ر.س</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-medium ${b.paid ? 'text-green-600' : 'text-copper'}`}>
                          {b.paid ? 'مدفوع' : 'غير مدفوع'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-8 h-8 rounded-lg hover:bg-cream flex items-center justify-center text-charcoal-light hover:text-olive transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg hover:bg-cream flex items-center justify-center text-charcoal-light hover:text-charcoal transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-cream-dark flex items-center justify-between">
            <p className="text-xs text-charcoal-light">عرض {filtered.length} من {bookings.length} حجز</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg border border-cream-dark flex items-center justify-center hover:bg-cream transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-olive text-white flex items-center justify-center text-sm font-medium">1</button>
              <button className="w-8 h-8 rounded-lg border border-cream-dark flex items-center justify-center text-sm hover:bg-cream transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg border border-cream-dark flex items-center justify-center text-sm hover:bg-cream transition-colors">3</button>
              <button className="w-8 h-8 rounded-lg border border-cream-dark flex items-center justify-center hover:bg-cream transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
