'use client';

import { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

const CARAVANS = [
  { id: '1', name: 'كرفان الصحراء الذهبي' },
  { id: '2', name: 'كرفان الشاطئ الفاخر' },
  { id: '3', name: 'كرفان العائلة المريح' },
  { id: '4', name: 'كرفان المغامرة' },
];

const WEEKDAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

// Mock data: booked and blocked dates per caravan
const mockBookedDates: Record<string, string[]> = {
  '1': ['2026-03-28', '2026-03-29', '2026-03-30', '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18'],
  '2': ['2026-04-01', '2026-04-02', '2026-04-03', '2026-04-20', '2026-04-21', '2026-04-22'],
  '3': ['2026-03-28', '2026-03-29', '2026-03-30', '2026-03-31'],
  '4': [],
};

const mockBlockedDates: Record<string, string[]> = {
  '1': ['2026-04-01', '2026-04-02'],
  '2': ['2026-03-25', '2026-03-26'],
  '3': [],
  '4': ['2026-04-10', '2026-04-11', '2026-04-12'],
};

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export default function OwnerCalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedCaravan, setSelectedCaravan] = useState(CARAVANS[0]?.id ?? '');
  const [localBlocked, setLocalBlocked] = useState<Record<string, string[]>>(mockBlockedDates);

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const bookedSet = useMemo(
    () => new Set(mockBookedDates[selectedCaravan] || []),
    [selectedCaravan]
  );

  const blockedSet = useMemo(
    () => new Set(localBlocked[selectedCaravan] || []),
    [selectedCaravan, localBlocked]
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const toggleBlock = (dateKey: string) => {
    if (bookedSet.has(dateKey)) return; // Can't block booked dates

    setLocalBlocked((prev) => {
      const current = prev[selectedCaravan] || [];
      const isBlocked = current.includes(dateKey);
      return {
        ...prev,
        [selectedCaravan]: isBlocked
          ? current.filter((d) => d !== dateKey)
          : [...current, dateKey],
      };
    });
  };

  // Build calendar grid
  const calendarDays = [];
  // Empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

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
          <h1 className="text-3xl font-bold text-white">تقويم التوفر</h1>
          <p className="text-white/60 mt-2">إدارة أيام التوفر والحجوزات لكرفاناتك</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Caravan Selector */}
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-4 mb-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-olive" />
              <select
                value={selectedCaravan}
                onChange={(e) => setSelectedCaravan(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all text-sm font-semibold text-charcoal bg-white"
              >
                {CARAVANS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden">
            {/* Month Navigation */}
            <div className="flex items-center justify-between p-6 border-b border-cream-dark">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-cream transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-charcoal" />
              </button>
              <h2 className="text-lg font-bold text-charcoal">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-cream transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-cream-dark">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-semibold text-charcoal-light"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-16 sm:h-20 border-b border-e border-cream-dark" />;
                }

                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const isToday = dateKey === todayKey;
                const isBooked = bookedSet.has(dateKey);
                const isBlocked = blockedSet.has(dateKey);

                let bgClass = 'bg-green-50 hover:bg-green-100 cursor-pointer'; // Available
                let textClass = 'text-charcoal';

                if (isBooked) {
                  bgClass = 'bg-olive/15';
                  textClass = 'text-olive font-bold';
                } else if (isBlocked) {
                  bgClass = 'bg-gray-100 hover:bg-gray-200 cursor-pointer';
                  textClass = 'text-gray-400 line-through';
                }

                return (
                  <button
                    key={dateKey}
                    onClick={() => toggleBlock(dateKey)}
                    disabled={isBooked}
                    className={`h-16 sm:h-20 border-b border-e border-cream-dark flex flex-col items-center justify-center transition-colors relative ${bgClass} ${
                      isBooked ? 'cursor-default' : ''
                    }`}
                  >
                    {isToday && (
                      <div className="absolute inset-1 rounded-xl border-2 border-copper pointer-events-none" />
                    )}
                    <span className={`text-sm sm:text-base ${textClass}`}>{day}</span>
                    {isBooked && (
                      <span className="text-[10px] text-olive mt-0.5 hidden sm:block">محجوز</span>
                    )}
                    {isBlocked && !isBooked && (
                      <span className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">محظور</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 mt-6">
            <h3 className="text-sm font-semibold text-charcoal mb-4">دليل الألوان</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-green-50 border border-green-200" />
                <span className="text-sm text-charcoal-light">متاح</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-olive/15 border border-olive/30" />
                <span className="text-sm text-charcoal-light">محجوز</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gray-100 border border-gray-200" />
                <span className="text-sm text-charcoal-light">محظور</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white border-2 border-copper" />
                <span className="text-sm text-charcoal-light">اليوم</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light mt-4">
              اضغط على أي يوم متاح لحظره، أو اضغط على يوم محظور لإلغاء الحظر. لا يمكن تعديل الأيام المحجوزة.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
