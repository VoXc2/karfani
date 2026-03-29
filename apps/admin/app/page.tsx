'use client';

import { useState } from 'react';
import TopBar from '../components/TopBar';
import {
  CalendarCheck, Truck, TrendingUp, Users, ArrowUp, ArrowDown,
  Eye, Clock, AlertTriangle, CheckCircle, ChevronLeft
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Link from 'next/link';

// KPI Data
const kpis = [
  { title: 'إجمالي الحجوزات', value: '247', change: '+12%', up: true, icon: CalendarCheck, color: 'olive', period: 'هذا الشهر' },
  { title: 'الكرفانات النشطة', value: '48', change: '+3', up: true, icon: Truck, color: 'copper', period: 'من أصل 52' },
  { title: 'الإيرادات', value: '345,000', unit: 'ر.س', change: '+18%', up: true, icon: TrendingUp, color: 'olive', period: 'هذا الشهر' },
  { title: 'معدل الإشغال', value: '72%', change: '-3%', up: false, icon: Users, color: 'sand-dark', period: 'هذا الأسبوع' },
];

// Revenue Chart Data
const revenueData = [
  { month: 'يناير', revenue: 180000, bookings: 32 },
  { month: 'فبراير', revenue: 195000, bookings: 38 },
  { month: 'مارس', revenue: 220000, bookings: 45 },
  { month: 'أبريل', revenue: 260000, bookings: 52 },
  { month: 'مايو', revenue: 290000, bookings: 58 },
  { month: 'يونيو', revenue: 310000, bookings: 64 },
  { month: 'يوليو', revenue: 345000, bookings: 70 },
];

// Booking Status Distribution
const statusData = [
  { name: 'مكتملة', value: 145, color: '#4A5D3A' },
  { name: 'نشطة', value: 32, color: '#C67B3C' },
  { name: 'قادمة', value: 48, color: '#D4A574' },
  { name: 'ملغاة', value: 22, color: '#E8CDB0' },
];

// Weekly Bookings
const weeklyData = [
  { day: 'السبت', bookings: 12 },
  { day: 'الأحد', bookings: 8 },
  { day: 'الاثنين', bookings: 6 },
  { day: 'الثلاثاء', bookings: 9 },
  { day: 'الأربعاء', bookings: 11 },
  { day: 'الخميس', bookings: 15 },
  { day: 'الجمعة', bookings: 18 },
];

// Recent Bookings
const recentBookings = [
  { id: 'KRF-2847', customer: 'أحمد الشهري', caravan: 'كرفان عائلي فاخر', date: '15-20 مارس', status: 'مؤكد', amount: 6000, statusColor: 'olive' },
  { id: 'KRF-2846', customer: 'نورة القحطاني', caravan: 'فان مغامرات', date: '18-22 مارس', status: 'بانتظار الدفع', amount: 2800, statusColor: 'copper' },
  { id: 'KRF-2845', customer: 'فهد العتيبي', caravan: 'كرفان رحلات طويلة', date: '10-15 مارس', status: 'تحت التجهيز', amount: 4750, statusColor: 'sand-dark' },
  { id: 'KRF-2844', customer: 'سارة المطيري', caravan: 'كرفان شاطئ البحر', date: '8-12 مارس', status: 'نشط', amount: 4400, statusColor: 'olive' },
  { id: 'KRF-2843', customer: 'خالد الدوسري', caravan: 'فان تخييم جبلي', date: '5-8 مارس', status: 'مكتمل', amount: 1800, statusColor: 'charcoal-light' },
];

// Quick Actions
const quickActions = [
  { label: 'حجز جديد', icon: CalendarCheck, color: 'olive', href: '/bookings' },
  { label: 'إضافة كرفان', icon: Truck, color: 'copper', href: '/caravans' },
  { label: 'تذاكر مفتوحة', icon: AlertTriangle, color: 'sand-dark', href: '/support', count: 5 },
  { label: 'فحوصات اليوم', icon: CheckCircle, color: 'olive', href: '/inspections', count: 3 },
];

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('monthly');

  return (
    <div className="min-h-screen">
      <TopBar title="لوحة التحكم" />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className="bg-white rounded-2xl p-5 border border-cream-dark hover:shadow-lg hover:shadow-charcoal/5 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    kpi.color === 'olive' ? 'bg-olive/10 text-olive' :
                    kpi.color === 'copper' ? 'bg-copper/10 text-copper' :
                    'bg-sand/20 text-sand-dark'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-charcoal">{kpi.value}</span>
                  {kpi.unit && <span className="text-sm text-charcoal-light">{kpi.unit}</span>}
                </div>
                <p className="text-sm text-charcoal-light mt-1">{kpi.title}</p>
                <p className="text-xs text-charcoal-light/60 mt-0.5">{kpi.period}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-cream-dark">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-charcoal">الإيرادات والحجوزات</h3>
                <p className="text-xs text-charcoal-light mt-0.5">نظرة عامة على الأداء المالي</p>
              </div>
              <div className="flex items-center gap-1 bg-cream rounded-lg p-1">
                <button
                  onClick={() => setChartPeriod('weekly')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    chartPeriod === 'weekly' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-light'
                  }`}
                >
                  أسبوعي
                </button>
                <button
                  onClick={() => setChartPeriod('monthly')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    chartPeriod === 'monthly' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-light'
                  }`}
                >
                  شهري
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A5D3A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4A5D3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4A4A4A' }} />
                <YAxis tick={{ fontSize: 12, fill: '#4A4A4A' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #F0E8DA', fontSize: 13 }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `${value.toLocaleString()} ر.س` : value,
                    name === 'revenue' ? 'الإيرادات' : 'الحجوزات'
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4A5D3A" fill="url(#revenueGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie Chart */}
          <div className="bg-white rounded-2xl p-5 border border-cream-dark">
            <h3 className="font-bold text-charcoal mb-1">حالات الحجوزات</h3>
            <p className="text-xs text-charcoal-light mb-4">توزيع الحجوزات حسب الحالة</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value} حجز`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-charcoal-light">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Weekly Bookings Bar */}
          <div className="bg-white rounded-2xl p-5 border border-cream-dark">
            <h3 className="font-bold text-charcoal mb-1">حجوزات الأسبوع</h3>
            <p className="text-xs text-charcoal-light mb-4">عدد الحجوزات اليومية</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#4A4A4A' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4A4A4A' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #F0E8DA', fontSize: 13 }}
                  formatter={(value: number) => [`${value} حجز`, 'الحجوزات']}
                />
                <Bar dataKey="bookings" fill="#C67B3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Bookings */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-cream-dark overflow-hidden">
            <div className="px-5 py-4 border-b border-cream-dark flex items-center justify-between">
              <div>
                <h3 className="font-bold text-charcoal">أحدث الحجوزات</h3>
                <p className="text-xs text-charcoal-light mt-0.5">آخر 5 حجوزات</p>
              </div>
              <Link href="/bookings" className="flex items-center gap-1 text-xs text-olive font-medium hover:underline">
                عرض الكل
                <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream/50">
                  <tr>
                    <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">رقم الحجز</th>
                    <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">العميل</th>
                    <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">الكرفان</th>
                    <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">التاريخ</th>
                    <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">الحالة</th>
                    <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-cream/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3 text-sm font-mono font-semibold text-olive">{b.id}</td>
                      <td className="px-5 py-3 text-sm text-charcoal">{b.customer}</td>
                      <td className="px-5 py-3 text-sm text-charcoal-light">{b.caravan}</td>
                      <td className="px-5 py-3 text-sm text-charcoal-light">{b.date}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          b.statusColor === 'olive' ? 'bg-olive/10 text-olive' :
                          b.statusColor === 'copper' ? 'bg-copper/10 text-copper' :
                          b.statusColor === 'sand-dark' ? 'bg-sand/20 text-sand-dark' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-charcoal">{b.amount.toLocaleString()} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-4 p-4 bg-white rounded-2xl border border-cream-dark hover:shadow-lg hover:shadow-charcoal/5 transition-all group hover:-translate-y-0.5`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  action.color === 'olive' ? 'bg-olive/10 text-olive' :
                  action.color === 'copper' ? 'bg-copper/10 text-copper' :
                  'bg-sand/20 text-sand-dark'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-charcoal text-sm">{action.label}</p>
                  {action.count && (
                    <p className="text-xs text-charcoal-light">{action.count} بانتظار الاستجابة</p>
                  )}
                </div>
                <ChevronLeft className="w-4 h-4 text-charcoal-light rtl:rotate-180 group-hover:text-olive transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
