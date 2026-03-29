'use client';

import { useState } from 'react';
import { Bell, Search, User, ChevronDown, Settings, LogOut } from 'lucide-react';

const notifications = [
  { id: 1, text: 'حجز جديد #KRF-2847 بانتظار التأكيد', time: 'منذ 5 دقائق', type: 'booking' },
  { id: 2, text: 'تقرير ضرر جديد للكرفان #C-042', time: 'منذ 30 دقيقة', type: 'damage' },
  { id: 3, text: 'طلب دعم فني جديد #TKT-1923', time: 'منذ ساعة', type: 'support' },
  { id: 4, text: 'اكتمال صيانة الكرفان #C-018', time: 'منذ ساعتين', type: 'maintenance' },
];

export default function TopBar({ title }: { title: string }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-cream-dark px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-charcoal">{title}</h1>
        <p className="text-xs text-charcoal-light">
          {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
          <input
            type="text"
            placeholder="بحث سريع..."
            className="ps-10 pe-4 py-2 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:bg-white focus:border-olive outline-none transition-all w-64"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-10 h-10 rounded-xl bg-cream/50 flex items-center justify-center hover:bg-cream transition-colors"
          >
            <Bell className="w-5 h-5 text-charcoal-light" />
            <span className="absolute -top-0.5 -end-0.5 w-5 h-5 bg-copper text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          </button>

          {notifOpen && (
            <div className="absolute top-full mt-2 end-0 w-80 bg-white rounded-2xl shadow-2xl border border-cream-dark overflow-hidden">
              <div className="px-4 py-3 border-b border-cream-dark flex items-center justify-between">
                <span className="font-semibold text-charcoal text-sm">الإشعارات</span>
                <button className="text-xs text-olive hover:underline">تحديد الكل كمقروء</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-cream/50 cursor-pointer border-b border-cream-dark/50 last:border-0">
                    <p className="text-sm text-charcoal">{n.text}</p>
                    <p className="text-xs text-charcoal-light mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-cream-dark text-center">
                <button className="text-xs text-olive font-medium hover:underline">عرض كل الإشعارات</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream/50 transition-colors"
          >
            <div className="w-8 h-8 bg-olive rounded-lg flex items-center justify-center text-white text-sm font-bold">
              م
            </div>
            <div className="hidden sm:block text-start">
              <p className="text-sm font-semibold text-charcoal">مدير النظام</p>
              <p className="text-[10px] text-charcoal-light">admin@karfani.sa</p>
            </div>
            <ChevronDown className="w-3 h-3 text-charcoal-light hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute top-full mt-2 end-0 w-48 bg-white rounded-xl shadow-2xl border border-cream-dark overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-cream/50 transition-colors">
                <User className="w-4 h-4" />
                الملف الشخصي
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-cream/50 transition-colors">
                <Settings className="w-4 h-4" />
                الإعدادات
              </button>
              <div className="border-t border-cream-dark" />
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
