'use client';

import TopBar from '../../components/TopBar';
import {
  TrendingUp, TrendingDown, Users, MapPin, Star, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const monthlyRevenue = [
  { month: 'يناير', revenue: 180000, expenses: 45000 },
  { month: 'فبراير', revenue: 195000, expenses: 48000 },
  { month: 'مارس', revenue: 220000, expenses: 52000 },
  { month: 'أبريل', revenue: 260000, expenses: 58000 },
  { month: 'مايو', revenue: 290000, expenses: 62000 },
  { month: 'يونيو', revenue: 310000, expenses: 65000 },
  { month: 'يوليو', revenue: 345000, expenses: 70000 },
];

const regionData = [
  { region: 'الرياض', bookings: 85, revenue: 120000 },
  { region: 'جدة', bookings: 62, revenue: 88000 },
  { region: 'العلا', bookings: 45, revenue: 64000 },
  { region: 'عسير', bookings: 38, revenue: 52000 },
  { region: 'الباحة', bookings: 28, revenue: 35000 },
  { region: 'تبوك', bookings: 22, revenue: 30000 },
];

const typeDistribution = [
  { name: 'كرفان متنقل', value: 42, color: '#4A5D3A' },
  { name: 'فان مجهز', value: 28, color: '#C67B3C' },
  { name: 'مقطورة', value: 18, color: '#D4A574' },
  { name: 'كرفان فاخر', value: 12, color: '#E8CDB0' },
];

const occupancyData = [
  { week: 'أسبوع 1', rate: 65 },
  { week: 'أسبوع 2', rate: 72 },
  { week: 'أسبوع 3', rate: 68 },
  { week: 'أسبوع 4', rate: 78 },
  { week: 'أسبوع 5', rate: 82 },
  { week: 'أسبوع 6', rate: 75 },
  { week: 'أسبوع 7', rate: 85 },
  { week: 'أسبوع 8', rate: 72 },
];

const topCaravans = [
  { name: 'كرفان فاخر VIP', bookings: 28, revenue: 61600, rating: 5.0 },
  { name: 'كرفان عائلي فاخر', bookings: 45, revenue: 54000, rating: 4.8 },
  { name: 'كرفان الأحلام', bookings: 22, revenue: 39600, rating: 4.9 },
  { name: 'فان مغامرات الصحراء', bookings: 52, revenue: 36400, rating: 4.9 },
  { name: 'كرفان رحلات طويلة', bookings: 38, revenue: 36100, rating: 4.7 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <TopBar title="التحليلات والتقارير" />

      <div className="p-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: 'إجمالي الإيرادات', value: '1,800,000', unit: 'ر.س', change: '+24%', up: true, icon: TrendingUp },
            { title: 'إجمالي الحجوزات', value: '1,247', change: '+18%', up: true, icon: Calendar },
            { title: 'المستخدمين النشطين', value: '3,420', change: '+32%', up: true, icon: Users },
            { title: 'متوسط التقييم', value: '4.8', change: '+0.1', up: true, icon: Star },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className="bg-white rounded-2xl p-5 border border-cream-dark">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-olive" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-charcoal">{kpi.value}</span>
                  {kpi.unit && <span className="text-sm text-charcoal-light">{kpi.unit}</span>}
                </div>
                <p className="text-sm text-charcoal-light mt-1">{kpi.title}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue vs Expenses */}
        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-cream-dark">
            <h3 className="font-bold text-charcoal mb-1">الإيرادات مقابل المصروفات</h3>
            <p className="text-xs text-charcoal-light mb-6">أداء مالي شهري</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A5D3A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4A5D3A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C67B3C" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#C67B3C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4A4A4A' }} />
                <YAxis tick={{ fontSize: 12, fill: '#4A4A4A' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #F0E8DA', fontSize: 13 }} formatter={(v: number, n: string) => [`${v.toLocaleString()} ر.س`, n === 'revenue' ? 'الإيرادات' : 'المصروفات']} />
                <Area type="monotone" dataKey="revenue" stroke="#4A5D3A" fill="url(#revGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="expenses" stroke="#C67B3C" fill="url(#expGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Type Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-cream-dark">
            <h3 className="font-bold text-charcoal mb-1">أنواع الكرفانات</h3>
            <p className="text-xs text-charcoal-light mb-4">توزيع حسب النوع</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {typeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {typeDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-charcoal">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-charcoal">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Region & Occupancy */}
        <div className="grid xl:grid-cols-2 gap-6">
          {/* Region Performance */}
          <div className="bg-white rounded-2xl p-5 border border-cream-dark">
            <h3 className="font-bold text-charcoal mb-1">أداء المناطق</h3>
            <p className="text-xs text-charcoal-light mb-6">حجوزات وإيرادات حسب المنطقة</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#4A4A4A' }} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 12, fill: '#4A4A4A' }} width={60} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #F0E8DA', fontSize: 13 }} formatter={(v: number) => [`${v}`, 'حجوزات']} />
                <Bar dataKey="bookings" fill="#4A5D3A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy Trend */}
          <div className="bg-white rounded-2xl p-5 border border-cream-dark">
            <h3 className="font-bold text-charcoal mb-1">معدل الإشغال</h3>
            <p className="text-xs text-charcoal-light mb-6">نسبة إشغال الكرفانات أسبوعياً</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DA" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#4A4A4A' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4A4A4A' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #F0E8DA', fontSize: 13 }} formatter={(v: number) => [`${v}%`, 'نسبة الإشغال']} />
                <Line type="monotone" dataKey="rate" stroke="#C67B3C" strokeWidth={2.5} dot={{ fill: '#C67B3C', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Caravans */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="px-5 py-4 border-b border-cream-dark">
            <h3 className="font-bold text-charcoal">أفضل الكرفانات أداءً</h3>
            <p className="text-xs text-charcoal-light mt-0.5">مرتبة حسب الإيرادات</p>
          </div>
          <table className="w-full">
            <thead className="bg-cream/30">
              <tr>
                <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">#</th>
                <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">الكرفان</th>
                <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">الحجوزات</th>
                <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">الإيرادات</th>
                <th className="text-start px-5 py-2.5 text-xs font-semibold text-charcoal-light">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {topCaravans.map((c, i) => (
                <tr key={c.name} className="hover:bg-cream/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-olive">{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-charcoal">{c.name}</td>
                  <td className="px-5 py-3 text-sm text-charcoal-light">{c.bookings} حجز</td>
                  <td className="px-5 py-3 text-sm font-semibold text-charcoal">{c.revenue.toLocaleString()} ر.س</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-copper text-copper" />
                      <span className="text-sm font-medium">{c.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
