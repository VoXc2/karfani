'use client';

import { useState } from 'react';
import TopBar from '../../components/TopBar';
import {
  Search, Eye, Edit, Users, UserCheck, ShieldCheck, Home,
  Phone, Mail, Filter
} from 'lucide-react';

const roleConfig: Record<string, { label: string; bg: string; text: string }> = {
  CUSTOMER: { label: 'عميل', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  CARAVAN_OWNER: { label: 'مالك كرفان', bg: 'bg-copper/10', text: 'text-copper' },
  ADMIN: { label: 'مدير', bg: 'bg-olive/10', text: 'text-olive' },
};

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'نشط', bg: 'bg-olive/10', text: 'text-olive' },
  inactive: { label: 'غير نشط', bg: 'bg-gray-100', text: 'text-gray-500' },
  suspended: { label: 'موقوف', bg: 'bg-red-100', text: 'text-red-600' },
};

const users = [
  {
    id: 'USR-001',
    name: 'عبدالله المهندس',
    phone: '0551234567',
    email: 'abdullah@email.com',
    roles: ['CUSTOMER'],
    status: 'active',
    verified: true,
    joinedDate: '2025-08-15',
    bookings: 12,
  },
  {
    id: 'USR-002',
    name: 'سارة الخالدي',
    phone: '0559876543',
    email: 'sarah@email.com',
    roles: ['CUSTOMER', 'CARAVAN_OWNER'],
    status: 'active',
    verified: true,
    joinedDate: '2025-09-22',
    bookings: 8,
  },
  {
    id: 'USR-003',
    name: 'محمد الراشد',
    phone: '0543216789',
    email: 'mohammed@email.com',
    roles: ['CARAVAN_OWNER'],
    status: 'active',
    verified: true,
    joinedDate: '2025-07-10',
    bookings: 0,
  },
  {
    id: 'USR-004',
    name: 'فيصل العمري',
    phone: '0567891234',
    email: 'faisal@email.com',
    roles: ['CUSTOMER'],
    status: 'inactive',
    verified: false,
    joinedDate: '2026-01-05',
    bookings: 3,
  },
  {
    id: 'USR-005',
    name: 'نورة القحطاني',
    phone: '0578901234',
    email: 'noura@email.com',
    roles: ['CUSTOMER'],
    status: 'active',
    verified: true,
    joinedDate: '2025-11-18',
    bookings: 6,
  },
  {
    id: 'USR-006',
    name: 'خالد الدوسري',
    phone: '0589012345',
    email: 'khaled@email.com',
    roles: ['ADMIN'],
    status: 'active',
    verified: true,
    joinedDate: '2025-06-01',
    bookings: 0,
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && !u.roles.includes(roleFilter)) return false;
    if (search && !u.name.includes(search) && !u.phone.includes(search) && !u.email.includes(search) && !u.id.includes(search)) return false;
    return true;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const verifiedUsers = users.filter((u) => u.verified).length;
  const ownerUsers = users.filter((u) => u.roles.includes('CARAVAN_OWNER')).length;

  return (
    <div className="min-h-screen">
      <TopBar title="إدارة المستخدمين" />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-olive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{totalUsers}</p>
                <p className="text-xs text-charcoal-light">إجمالي المستخدمين</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{activeUsers}</p>
                <p className="text-xs text-charcoal-light">مستخدم نشط</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-copper" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{verifiedUsers}</p>
                <p className="text-xs text-charcoal-light">حساب موثق</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-dark">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sand/20 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-sand-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{ownerUsers}</p>
                <p className="text-xs text-charcoal-light">مالك كرفان</p>
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
                placeholder="بحث بالاسم أو رقم الجوال..."
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-cream-dark text-sm focus:border-olive outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-cream-dark text-sm font-medium focus:border-olive outline-none cursor-pointer"
              >
                <option value="all">جميع الأدوار</option>
                <option value="CUSTOMER">عميل</option>
                <option value="CARAVAN_OWNER">مالك كرفان</option>
                <option value="ADMIN">مدير</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 border-b border-cream-dark">
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الاسم</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">رقم الجوال</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">البريد الإلكتروني</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الأدوار</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الحالة</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">تاريخ الانضمام</th>
                  <th className="text-start px-4 py-3 text-xs font-semibold text-charcoal-light">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const status = statusConfig[user.status]!;
                  return (
                    <tr key={user.id} className="border-b border-cream-dark/50 last:border-0 hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-olive/10 rounded-lg flex items-center justify-center text-olive text-sm font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-charcoal">{user.name}</p>
                            <p className="text-xs text-charcoal-light font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-charcoal-light" />
                          <span className="text-sm text-charcoal" dir="ltr">{user.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-charcoal-light" />
                          <span className="text-sm text-charcoal" dir="ltr">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => {
                            const roleStyle = roleConfig[role]!;
                            return (
                              <span key={role} className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${roleStyle.bg} ${roleStyle.text}`}>
                                {roleStyle.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                          {user.verified && (
                            <span className="flex items-center gap-1 text-[10px] text-olive">
                              <ShieldCheck className="w-3 h-3" />
                              موثق
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-charcoal">{user.joinedDate}</p>
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
              <Users className="w-12 h-12 text-charcoal-light/30 mx-auto mb-3" />
              <p className="text-sm text-charcoal-light">لا يوجد مستخدمون مطابقون للبحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
