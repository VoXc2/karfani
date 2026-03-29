'use client';

import { useState } from 'react';
import { User, Phone, Mail, MapPin, Camera, Save, ArrowRight } from 'lucide-react';
import { Link } from '../../../../i18n/navigation';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: 'عبدالله محمد الشهري',
    email: 'abdullah@example.com',
    phone: '0512345678',
    city: 'الرياض',
    bio: 'محب للسفر البري واستكشاف الطبيعة',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-white">الملف الشخصي</h1>
          <p className="text-white/60 mt-2">إدارة معلوماتك الشخصية</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Success message */}
          {saved && (
            <div className="bg-olive/10 border border-olive/20 rounded-2xl p-4 mb-6 text-center">
              <p className="text-olive font-semibold">تم حفظ التغييرات بنجاح!</p>
            </div>
          )}

          {/* Avatar Card */}
          <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-olive/10 rounded-2xl flex items-center justify-center">
                  <User className="w-10 h-10 text-olive" />
                </div>
                <button className="absolute -bottom-1 -end-1 w-8 h-8 bg-olive text-white rounded-xl flex items-center justify-center hover:bg-olive-dark transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-charcoal">{form.name}</h2>
                <p className="text-charcoal-light text-sm mt-1">عضو منذ يناير 2025</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-olive/10 text-olive text-xs font-semibold rounded-full">
                    مستأجر موثق
                  </span>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-5 py-2.5 border border-cream-dark text-charcoal rounded-2xl font-semibold text-sm hover:bg-white transition-all"
                >
                  تعديل
                </button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
            <h3 className="text-lg font-bold text-charcoal mb-6">المعلومات الشخصية</h3>

            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-2">
                  <User className="w-4 h-4 text-charcoal-light" />
                  الاسم الكامل
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 bg-cream rounded-xl text-charcoal">{form.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-2">
                  <Mail className="w-4 h-4 text-charcoal-light" />
                  البريد الإلكتروني
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all text-left"
                  />
                ) : (
                  <p className="px-4 py-3 bg-cream rounded-xl text-charcoal" dir="ltr">{form.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-2">
                  <Phone className="w-4 h-4 text-charcoal-light" />
                  رقم الجوال
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all text-left"
                  />
                ) : (
                  <p className="px-4 py-3 bg-cream rounded-xl text-charcoal" dir="ltr">{form.phone}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-2">
                  <MapPin className="w-4 h-4 text-charcoal-light" />
                  المدينة
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 bg-cream rounded-xl text-charcoal">{form.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">نبذة عنك</label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all resize-none"
                  />
                ) : (
                  <p className="px-4 py-3 bg-cream rounded-xl text-charcoal">{form.bio}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
                >
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-cream transition-all"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
