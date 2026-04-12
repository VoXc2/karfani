'use client';

import { useState } from 'react';
import TopBar from '../../components/TopBar';
import {
  Search, Eye, MessageSquare, Clock, CheckCircle, XCircle,
  AlertTriangle, Filter, Headphones, ArrowUpCircle
} from 'lucide-react';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  OPEN: { label: 'مفتوحة', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  IN_PROGRESS: { label: 'قيد المعالجة', bg: 'bg-copper/10', text: 'text-copper' },
  RESOLVED: { label: 'تم الحل', bg: 'bg-olive/10', text: 'text-olive' },
  CLOSED: { label: 'مغلقة', bg: 'bg-gray-100', text: 'text-gray-500' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
  LOW: { label: 'منخفضة', bg: 'bg-gray-100', text: 'text-gray-500' },
  MEDIUM: { label: 'متوسطة', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  HIGH: { label: 'عالية', bg: 'bg-copper/10', text: 'text-copper' },
  URGENT: { label: 'عاجلة', bg: 'bg-red-100', text: 'text-red-600' },
};

const tickets = [
  {
    id: 'TKT-1001',
    subject: 'مشكلة في حجز الكرفان',
    description: 'لا أستطيع إتمام عملية الحجز بعد الدفع',
    user: 'عبدالله المهندس',
    phone: '0551234567',
    priority: 'HIGH',
    status: 'OPEN',
    date: '2026-04-12',
    lastUpdate: 'منذ 10 دقائق',
  },
  {
    id: 'TKT-1002',
    subject: 'طلب استرجاع مبلغ',
    description: 'أريد استرجاع مبلغ الحجز بسبب إلغاء الرحلة',
    user: 'سارة الخالدي',
    phone: '0559876543',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    date: '2026-04-11',
    lastUpdate: 'منذ ساعة',
  },
  {
    id: 'TKT-1003',
    subject: 'استفسار عن التأمين',
    description: 'هل يشمل التأمين الأضرار الناتجة عن الطقس؟',
    user: 'محمد الراشد',
    phone: '0543216789',
    priority: 'LOW',
    status: 'RESOLVED',
    date: '2026-04-10',
    lastUpdate: 'منذ يومين',
  },
  {
    id: 'TKT-1004',
    subject: 'تأخر تسليم الكرفان',
    description: 'موعد التسليم كان الساعة 10 صباحاً ولم يتم التسليم حتى الآن',
    user: 'فيصل العمري',
    phone: '0567891234',
    priority: 'HIGH',
    status: 'OPEN',
    date: '2026-04-12',
    lastUpdate: 'منذ 30 دقيقة',
  },
  {
    id: 'TKT-1005',
    subject: 'مشكلة في تطبيق الجوال',
    description: 'التطبيق يتوقف عند محاولة رفع صور الكرفان',
    user: 'نورة القحطاني',
    phone: '0578901234',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    date: '2026-04-09',
    lastUpdate: 'منذ 3 ساعات',
  },
  {
    id: 'TKT-1006',
    subject: 'تحديث بيانات الحساب',
    description: 'أريد تغيير رقم الجوال المسجل في حسابي',
    user: 'خالد الدوسري',
    phone: '0589012345',
    priority: 'LOW',
    status: 'CLOSED',
    date: '2026-04-08',
    lastUpdate: 'منذ 4 أيام',
  },
];

export default function SupportPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (search && !t.id.includes(search) && !t.subject.includes(search) && !t.user.includes(search)) return false;
    return true;
  });

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;

  return (
    <div className="min-h-screen">
      <TopBar title="إدارة تذاكر الدعم" />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <Headphones className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{totalTickets}</p>
                <p className="text-xs text-charcoal-light">إجمالي التذاكر</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{openTickets}</p>
                <p className="text-xs text-charcoal-light">مفتوحة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-copper" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{inProgressTickets}</p>
                <p className="text-xs text-charcoal-light">قيد المعالجة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{resolvedTickets}</p>
                <p className="text-xs text-charcoal-light">تم الحل</p>
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
                placeholder="بحث برقم التذكرة أو اسم المستخدم..."
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
                <option value="OPEN">مفتوحة</option>
                <option value="IN_PROGRESS">قيد المعالجة</option>
                <option value="RESOLVED">تم الحل</option>
                <option value="CLOSED">مغلقة</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-cream-dark text-sm font-medium focus:border-olive outline-none cursor-pointer"
              >
                <option value="all">جميع الأولويات</option>
                <option value="LOW">منخفضة</option>
                <option value="MEDIUM">متوسطة</option>
                <option value="HIGH">عالية</option>
                <option value="URGENT">عاجلة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b border-cream-dark">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">رقم التذكرة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الموضوع</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">المستخدم</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الأولوية</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الحالة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">التاريخ</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => {
                  const status = statusConfig[ticket.status]!;
                  const priority = priorityConfig[ticket.priority]!;
                  return (
                    <tr key={ticket.id} className="border-b border-cream-dark/50 last:border-0 hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-charcoal">{ticket.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{ticket.subject}</p>
                          <p className="text-xs text-charcoal-light mt-0.5">{ticket.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-charcoal">{ticket.user}</p>
                          <p className="text-xs text-charcoal-light" dir="ltr">{ticket.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${priority.bg} ${priority.text}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-charcoal">{ticket.date}</p>
                          <p className="text-xs text-charcoal-light">{ticket.lastUpdate}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-olive text-olive rounded-xl text-xs font-medium hover:bg-olive hover:text-white transition-all">
                            <Eye className="w-3.5 h-3.5" />
                            عرض
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-cream-dark text-charcoal-light rounded-xl text-xs font-medium hover:bg-cream transition-all">
                            <MessageSquare className="w-3.5 h-3.5" />
                            رد
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Headphones className="w-12 h-12 text-charcoal-light/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal-light">لا توجد تذاكر مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
