'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  CreditCard,
  Truck,
  Percent,
  Calendar,
} from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

const revenueSummary = [
  { label: 'إجمالي الأرباح', value: '24,500', icon: DollarSign, color: 'bg-olive/10 text-olive' },
  { label: 'في انتظار التحويل', value: '4,800', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  { label: 'عمولة المنصة', value: '4,323', icon: Percent, color: 'bg-copper/10 text-copper' },
  { label: 'أرباح هذا الشهر', value: '6,200', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
];

const earningsByCaravan = [
  { name: 'كرفان الصحراء الذهبي', amount: 12500, percentage: 51 },
  { name: 'كرفان الشاطئ الفاخر', amount: 7200, percentage: 29 },
  { name: 'كرفان العائلة المريح', amount: 3800, percentage: 16 },
  { name: 'كرفان المغامرة', amount: 1000, percentage: 4 },
];

const payoutHistory = [
  { id: 'PO-001', date: '2026-03-15', amount: 5200, status: 'completed' as const, method: 'تحويل بنكي' },
  { id: 'PO-002', date: '2026-02-15', amount: 4800, status: 'completed' as const, method: 'تحويل بنكي' },
  { id: 'PO-003', date: '2026-01-15', amount: 3900, status: 'completed' as const, method: 'تحويل بنكي' },
  { id: 'PO-004', date: '2025-12-15', amount: 5100, status: 'completed' as const, method: 'تحويل بنكي' },
];

const payoutStatusConfig = {
  completed: { label: 'مكتمل', bg: 'bg-green-100', text: 'text-green-700' },
  pending: { label: 'قيد المعالجة', bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

export default function OwnerEarningsPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Link
            href="/owner"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-white">الأرباح والمدفوعات</h1>
          <p className="text-white/60 mt-2">تتبع إيراداتك ومدفوعاتك</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {revenueSummary.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-charcoal">{item.value} ر.س</div>
                <div className="text-sm text-charcoal-light mt-1">{item.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings by Caravan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6">
              <h2 className="text-lg font-bold text-charcoal mb-6">الأرباح حسب الكرفان</h2>

              <div className="space-y-5">
                {earningsByCaravan.map((caravan) => (
                  <div key={caravan.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-olive/10 rounded-lg flex items-center justify-center">
                          <Truck className="w-4 h-4 text-olive" />
                        </div>
                        <span className="text-sm font-semibold text-charcoal">
                          {caravan.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-olive">
                        {caravan.amount.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="w-full bg-cream-dark rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-olive to-olive-light h-3 rounded-full transition-all duration-500"
                        style={{ width: `${caravan.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-charcoal-light mt-1 text-left" dir="ltr">
                      {caravan.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payout Info & Request */}
          <div>
            <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 mb-4">
              <h2 className="text-lg font-bold text-charcoal mb-4">معلومات الحساب</h2>
              <div className="bg-cream rounded-2xl p-4 mb-4">
                <div className="text-xs text-charcoal-light mb-1">IBAN المسجل</div>
                <div className="text-sm font-mono font-semibold text-charcoal" dir="ltr">
                  SA03 8000 0000 6080 1016 7519
                </div>
              </div>
              <div className="bg-cream rounded-2xl p-4 mb-6">
                <div className="text-xs text-charcoal-light mb-1">الرصيد المتاح للسحب</div>
                <div className="text-2xl font-bold text-olive">4,800 ر.س</div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all">
                <CreditCard className="w-5 h-5" />
                طلب تحويل
              </button>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl border border-cream-dark shadow-sm mt-8">
          <div className="p-6 border-b border-cream-dark">
            <h2 className="text-lg font-bold text-charcoal">سجل المدفوعات</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-dark">
                  <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">
                    رقم العملية
                  </th>
                  <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">
                    التاريخ
                  </th>
                  <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">
                    المبلغ
                  </th>
                  <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">
                    الطريقة
                  </th>
                  <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {payoutHistory.map((payout) => {
                  const status = payoutStatusConfig[payout.status];
                  return (
                    <tr key={payout.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">
                        {payout.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-light" dir="ltr">
                        {payout.date}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-olive">
                        {payout.amount.toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal-light">{payout.method}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-cream-dark">
            {payoutHistory.map((payout) => {
              const status = payoutStatusConfig[payout.status];
              return (
                <div key={payout.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-charcoal">{payout.id}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-light" dir="ltr">{payout.date}</span>
                    <span className="font-bold text-olive">
                      {payout.amount.toLocaleString()} ر.س
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
