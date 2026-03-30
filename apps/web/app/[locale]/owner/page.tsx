'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Truck,
  CalendarCheck,
  DollarSign,
  Star,
  Plus,
  Calendar,
  TrendingUp,
  ChevronLeft,
  User,
  MapPin,
} from 'lucide-react';
import { Link } from '../../../i18n/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const kpis = [
  { label: 'إجمالي الكرفانات', value: '4', icon: Truck, color: 'bg-olive/10 text-olive' },
  { label: 'الحجوزات النشطة', value: '3', icon: CalendarCheck, color: 'bg-copper/10 text-copper' },
  { label: 'إجمالي الإيرادات', value: '24,500 ر.س', icon: DollarSign, color: 'bg-green-100 text-green-700' },
  { label: 'متوسط التقييم', value: '4.8', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
];

const recentBookings = [
  {
    id: 'BK-101',
    customer: 'أحمد الدوسري',
    caravan: 'كرفان الصحراء الذهبي',
    dates: '15 - 18 أبريل 2026',
    status: 'confirmed' as const,
    total: 2850,
  },
  {
    id: 'BK-102',
    customer: 'سارة العتيبي',
    caravan: 'كرفان الشاطئ الفاخر',
    dates: '1 - 4 مايو 2026',
    status: 'pending' as const,
    total: 3200,
  },
  {
    id: 'BK-103',
    customer: 'فهد القحطاني',
    caravan: 'كرفان العائلة المريح',
    dates: '10 - 13 مارس 2026',
    status: 'active' as const,
    total: 1950,
  },
  {
    id: 'BK-104',
    customer: 'نورة الشمري',
    caravan: 'فان المغامرة',
    dates: '20 - 22 فبراير 2026',
    status: 'completed' as const,
    total: 1500,
  },
];

const statusConfig = {
  confirmed: { label: 'مؤكد', bg: 'bg-green-100', text: 'text-green-700' },
  pending: { label: 'بانتظار الموافقة', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  active: { label: 'نشط', bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { label: 'مكتمل', bg: 'bg-gray-100', text: 'text-gray-700' },
};

const quickActions = [
  { label: 'إضافة كرفان', href: '/owner/caravans/new' as const, icon: Plus, desc: 'أضف كرفان جديد للمنصة' },
  { label: 'التقويم', href: '/owner/calendar' as const, icon: Calendar, desc: 'إدارة التوافر والحجوزات' },
  { label: 'الإيرادات', href: '/owner/earnings' as const, icon: TrendingUp, desc: 'تتبع أرباحك ومدفوعاتك' },
];

export default function OwnerDashboardPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal pt-28 pb-16">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-white/60 mt-2">مرحبا بك، عبدالله. إليك ملخص نشاطك</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-charcoal">{kpi.value}</div>
                <div className="text-sm text-charcoal-light mt-1">{kpi.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-charcoal">آخر الحجوزات</h2>
              <Link
                href={'/owner/bookings' as any}
                className="text-olive text-sm font-semibold hover:underline flex items-center gap-1"
              >
                عرض الكل
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-dark">
                      <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">العميل</th>
                      <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">الكرفان</th>
                      <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">التواريخ</th>
                      <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">الحالة</th>
                      <th className="text-start px-6 py-4 text-sm font-semibold text-charcoal-light">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => {
                      const status = statusConfig[booking.status];
                      return (
                        <tr key={booking.id} className="border-b border-cream-dark last:border-b-0 hover:bg-cream/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-olive/10 rounded-xl flex items-center justify-center">
                                <User className="w-4 h-4 text-olive" />
                              </div>
                              <span className="text-sm font-medium text-charcoal">{booking.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-charcoal">{booking.caravan}</td>
                          <td className="px-6 py-4 text-sm text-charcoal-light">{booking.dates}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-olive">
                            {booking.total.toLocaleString()} ر.س
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-6">إجراءات سريعة</h2>
            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="block bg-white rounded-2xl p-5 border border-cream-dark shadow-sm hover:shadow-md hover:border-olive/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-olive/10 rounded-2xl flex items-center justify-center group-hover:bg-olive/20 transition-colors">
                        <Icon className="w-6 h-6 text-olive" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-charcoal">{action.label}</div>
                        <div className="text-sm text-charcoal-light mt-0.5">{action.desc}</div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-charcoal-light rtl:rotate-180 group-hover:text-olive transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Owner Nav Links */}
            <div className="mt-8 bg-white rounded-2xl p-5 border border-cream-dark shadow-sm">
              <h3 className="font-semibold text-charcoal mb-4">إدارة</h3>
              <div className="space-y-2">
                {[
                  { label: 'كرفاناتي', href: '/owner/caravans' as const },
                  { label: 'الحجوزات', href: '/owner/bookings' as const },
                  { label: 'الإيرادات', href: '/owner/earnings' as const },
                  { label: 'التقويم', href: '/owner/calendar' as const },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href as any}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-charcoal hover:bg-cream transition-colors"
                  >
                    <span className="text-sm font-medium">{link.label}</span>
                    <ChevronLeft className="w-4 h-4 text-charcoal-light rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
