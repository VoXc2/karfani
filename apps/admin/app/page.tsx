'use client';

import { useState } from 'react';

// Sidebar Navigation
const sidebarItems = [
  { id: 'dashboard', icon: '📊', label: 'لوحة التحكم' },
  { id: 'bookings', icon: '📋', label: 'الحجوزات' },
  { id: 'caravans', icon: '🚐', label: 'الكرفانات' },
  { id: 'owners', icon: '👤', label: 'الملاك' },
  { id: 'inspections', icon: '🔍', label: 'الفحوصات' },
  { id: 'maintenance', icon: '🔧', label: 'الصيانة' },
  { id: 'support', icon: '💬', label: 'الدعم' },
  { id: 'finance', icon: '💰', label: 'المالية' },
  { id: 'analytics', icon: '📈', label: 'التحليلات' },
  { id: 'settings', icon: '⚙️', label: 'الإعدادات' },
];

// KPI Data
const kpis = [
  { label: 'إجمالي الحجوزات', value: '٢٤٧', change: '+١٢%', icon: '📋', color: 'olive' },
  { label: 'الكرفانات النشطة', value: '٤٨', change: '+٥', icon: '🚐', color: 'copper' },
  { label: 'الإيرادات (ر.س)', value: '٣٤٥,٠٠٠', change: '+٨%', icon: '💰', color: 'sand-dark' },
  { label: 'معدل الإشغال', value: '٧٢%', change: '+٣%', icon: '📊', color: 'olive' },
];

// Recent Bookings
const recentBookings = [
  { id: 'KRF-A8X3K2', customer: 'محمد أحمد', caravan: 'كرفان عائلي فاخر', dates: '١٥-١٨ مارس', status: 'مؤكد', amount: '٤,٨٠٠ ر.س', statusColor: 'bg-green-100 text-green-700' },
  { id: 'KRF-B5Y7M9', customer: 'سارة العلي', caravan: 'فان مغامرات', dates: '٢٠-٢٢ مارس', status: 'بانتظار الدفع', amount: '٢,١٠٠ ر.س', statusColor: 'bg-yellow-100 text-yellow-700' },
  { id: 'KRF-C2Z4N6', customer: 'خالد المطيري', caravan: 'كرفان رحلات', dates: '٢٥-٣٠ مارس', status: 'قيد التجهيز', amount: '٦,٩٠٠ ر.س', statusColor: 'bg-blue-100 text-blue-700' },
  { id: 'KRF-D9W1P3', customer: 'نورة الحربي', caravan: 'كرفان عائلي', dates: '١-٣ أبريل', status: 'نشط', amount: '٣,٦٠٠ ر.س', statusColor: 'bg-purple-100 text-purple-700' },
  { id: 'KRF-E6V8Q5', customer: 'فهد الدوسري', caravan: 'فان مجهز', dates: '٥-٧ أبريل', status: 'مكتمل', amount: '٢,٤٠٠ ر.س', statusColor: 'bg-gray-100 text-gray-700' },
];

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-white flex-shrink-0">
        <div className="p-6 border-b border-sidebar-hover">
          <h1 className="text-2xl font-bold text-sand">كرفاني</h1>
          <p className="text-sm text-gray-400 mt-1">لوحة التشغيل</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activePage === item.id
                  ? 'bg-olive text-white font-medium'
                  : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-cream-dark px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-charcoal">لوحة التحكم</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-charcoal-light hover:text-charcoal transition-colors">
              🔔
              <span className="absolute top-1 end-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-olive rounded-full flex items-center justify-center text-white text-sm font-bold">م</div>
              <span className="text-sm font-medium text-charcoal">مدير النظام</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{kpi.icon}</span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">{kpi.change}</span>
                </div>
                <p className="text-sm text-charcoal-light mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-charcoal">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-cream-dark flex items-center justify-between">
              <h3 className="text-lg font-bold text-charcoal">آخر الحجوزات</h3>
              <button className="text-sm text-olive hover:text-olive-dark transition-colors font-medium">عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-3 text-start text-sm font-semibold text-charcoal-light">رقم الحجز</th>
                    <th className="px-6 py-3 text-start text-sm font-semibold text-charcoal-light">العميل</th>
                    <th className="px-6 py-3 text-start text-sm font-semibold text-charcoal-light">الكرفان</th>
                    <th className="px-6 py-3 text-start text-sm font-semibold text-charcoal-light">التواريخ</th>
                    <th className="px-6 py-3 text-start text-sm font-semibold text-charcoal-light">الحالة</th>
                    <th className="px-6 py-3 text-start text-sm font-semibold text-charcoal-light">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-dark">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-olive font-medium">{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-charcoal">{booking.customer}</td>
                      <td className="px-6 py-4 text-sm text-charcoal-light">{booking.caravan}</td>
                      <td className="px-6 py-4 text-sm text-charcoal-light">{booking.dates}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.statusColor}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-charcoal">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: '➕', label: 'إضافة كرفان', color: 'bg-olive' },
              { icon: '✅', label: 'مراجعة معلقة', color: 'bg-copper' },
              { icon: '🔧', label: 'طلبات صيانة', color: 'bg-sand-dark' },
              { icon: '💬', label: 'تذاكر مفتوحة', color: 'bg-charcoal' },
            ].map((action) => (
              <button
                key={action.label}
                className={`${action.color} text-white rounded-2xl p-6 text-center hover:opacity-90 transition-opacity`}
              >
                <span className="text-3xl block mb-2">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
