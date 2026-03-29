'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarCheck, Truck, Users, ClipboardCheck,
  Wrench, HeadphonesIcon, Wallet, BarChart3, Settings,
  ChevronRight, ChevronLeft, Compass, LogOut, Bell
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/bookings', label: 'الحجوزات', icon: CalendarCheck, badge: 12 },
  { href: '/caravans', label: 'الكرفانات', icon: Truck },
  { href: '/owners', label: 'الملاك', icon: Users },
  { href: '/inspections', label: 'الفحوصات', icon: ClipboardCheck },
  { href: '/maintenance', label: 'الصيانة', icon: Wrench, badge: 3 },
  { href: '/support', label: 'الدعم', icon: HeadphonesIcon, badge: 5 },
  { href: '/finance', label: 'المالية', icon: Wallet },
  { href: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`fixed top-0 start-0 h-screen bg-[#1a1a2e] text-white transition-all duration-300 z-40 flex flex-col ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-olive to-olive-dark rounded-xl flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-sand">كرفاني</h1>
            <p className="text-[10px] text-gray-400">لوحة التحكم</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-olive text-white shadow-lg shadow-olive/20'
                  : 'text-gray-400 hover:bg-[#252545] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-olive-light'}`} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ms-auto px-2 py-0.5 bg-copper text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -end-1 w-4 h-4 bg-copper text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:bg-[#252545] hover:text-white transition-all text-sm"
        >
          {collapsed ? <ChevronLeft className="w-4 h-4 rtl:rotate-180" /> : (
            <>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              <span>تصغير القائمة</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
