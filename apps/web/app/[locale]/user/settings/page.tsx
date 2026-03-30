'use client';

import { useState } from 'react';
import { Settings, Bell, Globe, Shield, Trash2, Save, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from '../../../../i18n/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

interface NotificationSettings {
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
  bookingReminders: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  shareBookingHistory: boolean;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    sms: true,
    email: true,
    whatsapp: false,
    bookingReminders: true,
  });
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
    shareBookingHistory: false,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
        checked ? 'bg-olive' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
          checked ? 'start-[calc(100%-1.625rem)]' : 'start-0.5'
        }`}
      />
    </button>
  );

  return (
    <main className="overflow-hidden">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-olive via-olive-dark to-charcoal py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-7 h-7 text-sand" />
            <h1 className="text-3xl font-bold text-white">الإعدادات</h1>
          </div>
          <p className="text-white/60 mt-2">تخصيص تجربتك في كرفاني</p>
        </div>
      </div>

      <div className="min-h-[60vh] bg-cream py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Success message */}
            {saved && (
              <div className="bg-olive/10 border border-olive/20 rounded-2xl p-4 text-center">
                <p className="text-olive font-semibold">تم حفظ الإعدادات بنجاح!</p>
              </div>
            )}

            {/* Notification Preferences */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-olive" />
                </div>
                <h2 className="text-lg font-bold text-charcoal">تفضيلات الإشعارات</h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">إشعارات الرسائل النصية</p>
                    <p className="text-charcoal-light text-xs mt-0.5">استلام تحديثات عبر SMS</p>
                  </div>
                  <Toggle
                    checked={notifications.sms}
                    onChange={(val) => setNotifications({ ...notifications, sms: val })}
                  />
                </div>

                <div className="border-t border-cream-dark" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">إشعارات البريد الإلكتروني</p>
                    <p className="text-charcoal-light text-xs mt-0.5">استلام تحديثات عبر الإيميل</p>
                  </div>
                  <Toggle
                    checked={notifications.email}
                    onChange={(val) => setNotifications({ ...notifications, email: val })}
                  />
                </div>

                <div className="border-t border-cream-dark" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">إشعارات واتساب</p>
                    <p className="text-charcoal-light text-xs mt-0.5">استلام تحديثات عبر WhatsApp</p>
                  </div>
                  <Toggle
                    checked={notifications.whatsapp}
                    onChange={(val) => setNotifications({ ...notifications, whatsapp: val })}
                  />
                </div>

                <div className="border-t border-cream-dark" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">تذكيرات الحجوزات</p>
                    <p className="text-charcoal-light text-xs mt-0.5">تذكير قبل موعد الاستلام والتسليم</p>
                  </div>
                  <Toggle
                    checked={notifications.bookingReminders}
                    onChange={(val) => setNotifications({ ...notifications, bookingReminders: val })}
                  />
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-olive" />
                </div>
                <h2 className="text-lg font-bold text-charcoal">اللغة</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-cream-dark cursor-pointer hover:border-olive/30 transition-colors">
                  <input
                    type="radio"
                    name="language"
                    value="ar"
                    checked={language === 'ar'}
                    onChange={() => setLanguage('ar')}
                    className="w-5 h-5 text-olive accent-olive"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal text-sm">العربية</p>
                    <p className="text-charcoal-light text-xs mt-0.5">اللغة العربية (الافتراضية)</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-cream-dark cursor-pointer hover:border-olive/30 transition-colors">
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={language === 'en'}
                    onChange={() => setLanguage('en')}
                    className="w-5 h-5 text-olive accent-olive"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal text-sm">English</p>
                    <p className="text-charcoal-light text-xs mt-0.5">English language</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-olive/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-olive" />
                </div>
                <h2 className="text-lg font-bold text-charcoal">الخصوصية</h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">ملفي الشخصي مرئي للملاك</p>
                    <p className="text-charcoal-light text-xs mt-0.5">السماح لملاك الكرفانات بمشاهدة ملفك</p>
                  </div>
                  <Toggle
                    checked={privacy.profileVisible}
                    onChange={(val) => setPrivacy({ ...privacy, profileVisible: val })}
                  />
                </div>

                <div className="border-t border-cream-dark" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal text-sm">مشاركة سجل الحجوزات</p>
                    <p className="text-charcoal-light text-xs mt-0.5">إظهار تقييماتك وحجوزاتك السابقة</p>
                  </div>
                  <Toggle
                    checked={privacy.shareBookingHistory}
                    onChange={(val) => setPrivacy({ ...privacy, shareBookingHistory: val })}
                  />
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-charcoal">إجراءات الحساب</h2>
              </div>

              <p className="text-charcoal-light text-sm mb-4">
                حذف حسابك سيؤدي إلى إزالة جميع بياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
              </p>

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors"
              >
                حذف الحساب
              </button>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
              >
                <Save className="w-4 h-4" />
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-charcoal text-center mb-2">تأكيد حذف الحساب</h3>
            <p className="text-charcoal-light text-center mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف حسابك؟ سيتم حذف جميع بياناتك وحجوزاتك بشكل نهائي ولا يمكن استرجاعها.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-cream transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  // Mock delete action
                }}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors"
              >
                حذف نهائي
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
