'use client';

import { useState } from 'react';
import TopBar from '../../components/TopBar';
import {
  Search, Eye, DollarSign, TrendingUp, Clock, CreditCard,
  ArrowUpRight, ArrowDownRight, Filter, Banknote
} from 'lucide-react';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  COMPLETED: { label: 'مكتمل', bg: 'bg-olive/10', text: 'text-olive' },
  PENDING: { label: 'معلق', bg: 'bg-sand/20', text: 'text-sand-dark' },
  REFUNDED: { label: 'مسترجع', bg: 'bg-red-100', text: 'text-red-600' },
};

const payments = [
  {
    id: 'PAY-5001',
    bookingId: 'KRF-2841',
    user: 'عبدالله المهندس',
    caravan: 'كرفان عائلي فاخر',
    amount: 4800,
    commission: 480,
    method: 'مدى',
    status: 'COMPLETED',
    date: '2026-04-12',
  },
  {
    id: 'PAY-5002',
    bookingId: 'KRF-2843',
    user: 'سارة الخالدي',
    caravan: 'كرفان فاخر VIP',
    amount: 8800,
    commission: 880,
    method: 'Visa',
    status: 'COMPLETED',
    date: '2026-04-11',
  },
  {
    id: 'PAY-5003',
    bookingId: 'KRF-2845',
    user: 'محمد الراشد',
    caravan: 'فان مغامرات الصحراء',
    amount: 2800,
    commission: 280,
    method: 'Apple Pay',
    status: 'PENDING',
    date: '2026-04-11',
  },
  {
    id: 'PAY-5004',
    bookingId: 'KRF-2847',
    user: 'فيصل العمري',
    caravan: 'كرفان رحلات طويلة',
    amount: 3800,
    commission: 380,
    method: 'مدى',
    status: 'COMPLETED',
    date: '2026-04-10',
  },
  {
    id: 'PAY-5005',
    bookingId: 'KRF-2839',
    user: 'نورة القحطاني',
    caravan: 'كرفان شاطئ البحر',
    amount: 5500,
    commission: 550,
    method: 'Visa',
    status: 'REFUNDED',
    date: '2026-04-09',
  },
];

export default function FinancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = payments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.id.includes(search) && !p.bookingId.includes(search) && !p.user.includes(search) && !p.caravan.includes(search)) return false;
    return true;
  });

  const totalRevenue = payments.filter((p) => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0);
  const monthlyRevenue = payments.filter((p) => p.status === 'COMPLETED' && p.date.startsWith('2026-04')).reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payments.filter((p) => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = payments.filter((p) => p.status === 'COMPLETED').reduce((sum, p) => sum + p.commission, 0);

  return (
    <div className="min-h-screen">
      <TopBar title="الإدارة المالية" />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{totalRevenue.toLocaleString('ar-SA')}</p>
                <p className="text-xs text-charcoal-light">إجمالي الإيرادات (ر.س)</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{monthlyRevenue.toLocaleString('ar-SA')}</p>
                <p className="text-xs text-charcoal-light">إيرادات الشهر (ر.س)</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sand/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-sand-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{pendingPayouts.toLocaleString('ar-SA')}</p>
                <p className="text-xs text-charcoal-light">مدفوعات معلقة (ر.س)</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center">
                <Banknote className="w-5 h-5 text-copper" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{totalCommission.toLocaleString('ar-SA')}</p>
                <p className="text-xs text-charcoal-light">العمولات المكتسبة (ر.س)</p>
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
                placeholder="بحث برقم الدفع، رقم الحجز، أو اسم المستخدم..."
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
                <option value="COMPLETED">مكتمل</option>
                <option value="PENDING">معلق</option>
                <option value="REFUNDED">مسترجع</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b border-cream-dark">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">رقم الدفع</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">رقم الحجز</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">المستخدم</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الكرفان</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">المبلغ</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">العمولة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">طريقة الدفع</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الحالة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">التاريخ</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => {
                  const status = statusConfig[payment.status]!;
                  return (
                    <tr key={payment.id} className="border-b border-cream-dark/50 last:border-0 hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-charcoal">{payment.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-charcoal-light">{payment.bookingId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-charcoal">{payment.user}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-charcoal">{payment.caravan}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-charcoal">{payment.amount.toLocaleString('ar-SA')} ر.س</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-olive font-medium">{payment.commission.toLocaleString('ar-SA')} ر.س</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-charcoal-light" />
                          <span className="text-sm text-charcoal">{payment.method}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-charcoal">{payment.date}</p>
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-olive text-olive rounded-xl text-xs font-medium hover:bg-olive hover:text-white transition-all">
                          <Eye className="w-3.5 h-3.5" />
                          عرض
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-charcoal-light/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal-light">لا توجد مدفوعات مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
