'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../i18n/navigation';
import { Menu, X, Globe, ChevronDown, Compass, MapPin, Tent, User, Phone, Map } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/caravans' as const, label: t('nav.caravans'), icon: Compass },
    { href: '/explore' as const, label: t('nav.explore'), icon: Map },
    { href: '/routes' as const, label: t('nav.routes'), icon: MapPin },
    { href: '/experiences' as const, label: t('nav.experiences'), icon: Tent },
  ];

  return (
    <>
      <nav
        aria-label="التنقل الرئيسي"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-charcoal/5 py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-olive to-olive-dark rounded-xl flex items-center justify-center shadow-lg shadow-olive/25 group-hover:shadow-olive/40 transition-shadow">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold transition-colors ${scrolled ? 'text-olive' : 'text-charcoal'}`}>
                كرفاني
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-olive/10 text-olive'
                        : 'text-charcoal-light hover:bg-cream-dark hover:text-charcoal'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-charcoal-light hover:bg-cream-dark transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>العربية</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute top-full mt-2 end-0 bg-white rounded-xl shadow-xl border border-cream-dark overflow-hidden min-w-[140px] animate-in fade-in slide-in-from-top-2">
                    <a href="/ar" className="block px-4 py-2.5 text-sm hover:bg-cream transition-colors font-medium">العربية</a>
                    <a href="/en" className="block px-4 py-2.5 text-sm hover:bg-cream transition-colors">English</a>
                  </div>
                )}
              </div>

              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-olive to-olive-dark text-white rounded-xl hover:shadow-lg hover:shadow-olive/25 transition-all duration-300 font-medium text-sm hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                {t('common.login')}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="القائمة الجانبية"
              aria-expanded={mobileOpen}
              className="lg:hidden p-2 rounded-xl hover:bg-cream-dark transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 end-0 h-full w-80 bg-white shadow-2xl transition-transform duration-500 ${
            mobileOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-olive">كرفاني</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-cream-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal hover:bg-cream transition-colors"
                  >
                    <Icon className="w-5 h-5 text-olive" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-cream-dark mt-6 pt-6 space-y-3">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-olive text-white rounded-xl font-medium"
              >
                <User className="w-4 h-4" />
                {t('common.login')}
              </Link>
              <a
                href="tel:+966500000000"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 border border-olive text-olive rounded-xl font-medium"
              >
                <Phone className="w-4 h-4" />
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
