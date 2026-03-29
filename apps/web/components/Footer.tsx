'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';
import { Compass, Phone, Mail, MapPin, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-charcoal text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-olive via-copper to-sand" />
      <div className="absolute top-20 start-10 w-72 h-72 bg-olive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 end-10 w-96 h-96 bg-copper/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-olive to-olive-dark rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-sand">كرفاني</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">{t('description')}</p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-olive transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-olive transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sand mb-4">{t('links')}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/caravans" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">الكرفانات</Link></li>
              <li><Link href="/routes" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">المسارات</Link></li>
              <li><Link href="/experiences" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">التجارب</Link></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 rtl:hover:-translate-x-1 inline-block">عن كرفاني</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sand mb-4">{t('legal')}</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('privacy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sand mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-olive" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-olive" />
                <span>info@karfani.sa</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span>🇸🇦 صُنع في السعودية</span>
            <span>•</span>
            <span>PDPL Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
