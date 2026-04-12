'use client';

import { useState } from 'react';
import TopBar from '../../components/TopBar';
import {
  Search, Eye, Edit, Wrench, Calendar, CheckCircle,
  Clock, AlertTriangle, Filter, DollarSign
} from 'lucide-react';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  SCHEDULED: { label: 'مجدولة', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  IN_PROGRESS: { label: 'قيد التنفيذ', bg: 'bg-copper/10', text: 'text-copper' },
  COMPLETED: { label: 'مكتملة', bg: 'bg-olive/10', text: 'text-olive' },
};

const priorityConfig: Record<string, { label: string; bg: string; text: string }> = {
  LOW: { label: 'منخفضة', bg: 'bg-gray-100', text: 'text-gray-500' },
  MEDIUM: { label: 'متوسطة', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  HIGH: { label: 'عالية', bg: 'bg-copper/10', text: 'text-copper' },
  URGENT: { label: 'عاجلة', bg: 'bg-red-100', text: 'text-red-600' },
};

const maintenanceJobs = [
  {
    id: 'MNT-001',
    caravan: 'كرفان عائلي فاخر (C-001)',
    type: 'صيانة دورية',
    description: 'فحص شامل للمحرك وتغيير الزيت والفلاتر',
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    vendor: 'ورشة الخليج للصيانة',
    scheduledDate: '2026-04-15',
    cost: 1500,
  },
  {
    id: 'MNT-002',
    caravan: 'فان مغامرات الصحراء (C-012)',
    type: 'إصلاح طارئ',
    description: 'إصلاح نظام التكييف بالكامل',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    vendor: 'شركة التبريد المتقدمة',
    scheduledDate: '2026-04-12',
    cost: 3200,
  },
  {
    id: 'MNT-003',
    caravan: 'كرفان فاخر VIP (C-003)',
    type: 'صيانة وقائية',
    description: 'فحص وتجديد إطارات الكرفان الأربعة',
    priority: 'HIGH',
    status: 'SCHEDULED',
    vendor: 'مركز الإطارات السعودي',
    scheduledDate: '2026-04-18',
    cost: 4800,
  },
  {
    id: 'MNT-004',
    caravan: 'كرفان رحلات طويلة (C-008)',
    type: 'صيانة دورية',
    description: 'تنظيف وتعقيم خزان المياه وأنابيب الصرف',
    priority: 'LOW',
    status: 'COMPLETED',
    vendor: 'خدمات النظافة المتكاملة',
    scheduledDate: '2026-04-08',
    cost: 800,
  },
  {
    id: 'MNT-005',
    caravan: 'كرفان شاطئ البحر (C-023)',
    type: 'إصلاح أضرار',
    description: 'إصلاح تسريب في سقف الكرفان وتجديد العزل',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    vendor: 'مؤسسة الإصلاح المتقدم',
    scheduledDate: '2026-04-10',
    cost: 5500,
  },
];

export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = maintenanceJobs.filter((j) => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && j.priority !== priorityFilter) return false;
    if (search && !j.caravan.includes(search) && !j.id.includes(search) && !j.vendor.includes(search)) return false;
    return true;
  });

  const scheduledCount = maintenanceJobs.filter((j) => j.status === 'SCHEDULED').length;
  const inProgressCount = maintenanceJobs.filter((j) => j.status === 'IN_PROGRESS').length;
  const completedCount = maintenanceJobs.filter((j) => j.status === 'COMPLETED').length;
  const totalCost = maintenanceJobs.reduce((sum, j) => sum + j.cost, 0);

  return (
    <div className="min-h-screen">
      <TopBar title="إدارة الصيانة" />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{scheduledCount}</p>
                <p className="text-xs text-charcoal-light">مجدولة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-copper" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{inProgressCount}</p>
                <p className="text-xs text-charcoal-light">قيد التنفيذ</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{completedCount}</p>
                <p className="text-xs text-charcoal-light">مكتملة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sand/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-sand-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{totalCost.toLocaleString('ar-SA')}</p>
                <p className="text-xs text-charcoal-light">إجمالي التكاليف (ر.س)</p>
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
                placeholder="بحث بالكرفان، المعرف، أو المورد..."
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
                <option value="SCHEDULED">مجدولة</option>
                <option value="IN_PROGRESS">قيد التنفيذ</option>
                <option value="COMPLETED">مكتملة</option>
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

        {/* Maintenance Table */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b border-cream-dark">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الكرفان</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">نوع الصيانة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الأولوية</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الحالة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">المورد</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">التاريخ المجدول</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">التكلفة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => {
                  const status = statusConfig[job.status]!;
                  const priority = priorityConfig[job.priority]!;
                  return (
                    <tr key={job.id} className="border-b border-cream-dark/50 last:border-0 hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-charcoal">{job.caravan}</p>
                          <p className="text-xs text-charcoal-light font-mono">{job.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-charcoal">{job.type}</p>
                          <p className="text-xs text-charcoal-light mt-0.5">{job.description}</p>
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
                        <p className="text-sm text-charcoal">{job.vendor}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-charcoal">{job.scheduledDate}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-charcoal">{job.cost.toLocaleString('ar-SA')} ر.س</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-olive text-olive rounded-xl text-xs font-medium hover:bg-olive hover:text-white transition-all">
                            <Eye className="w-3.5 h-3.5" />
                            عرض
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-cream-dark text-charcoal-light rounded-xl text-xs font-medium hover:bg-cream transition-all">
                            <Edit className="w-3.5 h-3.5" />
                            تعديل
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
              <Wrench className="w-12 h-12 text-charcoal-light/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal-light">لا توجد مهام صيانة مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
