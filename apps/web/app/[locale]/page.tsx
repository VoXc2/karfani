import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../i18n/navigation';

// Navigation Component
function Navbar() {
  const t = useTranslations();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-olive">
              كرفاني
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/caravans" className="text-charcoal-light hover:text-olive transition-colors">{t('nav.caravans')}</Link>
              <Link href="/routes" className="text-charcoal-light hover:text-olive transition-colors">{t('nav.routes')}</Link>
              <Link href="/experiences" className="text-charcoal-light hover:text-olive transition-colors">{t('nav.experiences')}</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="px-5 py-2 bg-olive text-white rounded-xl hover:bg-olive-dark transition-colors font-medium">
              {t('common.login')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const t = useTranslations('hero');
  return (
    <section className="relative pt-16 min-h-[85vh] flex items-center bg-gradient-to-br from-sand-light via-cream to-olive/10">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(74,93,58,0.3),transparent_70%)]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-charcoal leading-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-charcoal-light mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-charcoal-light mb-1">{t('searchPlaceholder')}</label>
              <input type="text" placeholder="الرياض، عسير، جدة..." className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-charcoal-light mb-1">{t('startDate')}</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-charcoal-light mb-1">{t('endDate')}</label>
              <input type="date" className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all" />
            </div>
            <div className="flex items-end">
              <button className="w-full md:w-auto px-8 py-3 bg-copper text-white rounded-xl hover:bg-copper-light transition-colors font-semibold text-lg shadow-lg shadow-copper/25">
                {t('searchButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Caravans
function FeaturedCaravans() {
  const t = useTranslations('home');
  const caravans = [
    { id: 1, title: 'كرفان عائلي فاخر', sleeps: 6, price: 1200, rating: 4.8, type: 'كرفان متنقل', image: '🏕️' },
    { id: 2, title: 'فان مغامرات', sleeps: 2, price: 700, rating: 4.9, type: 'فان مجهز', image: '🚐' },
    { id: 3, title: 'كرفان رحلات طويلة', sleeps: 4, price: 950, rating: 4.7, type: 'مقطورة', image: '🏔️' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-3">{t('featuredTitle')}</h2>
          <p className="text-lg text-charcoal-light">{t('featuredSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {caravans.map((c) => (
            <div key={c.id} className="group bg-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-56 bg-gradient-to-br from-sand-light to-olive/20 flex items-center justify-center text-7xl">
                {c.image}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-olive font-medium bg-olive/10 px-3 py-1 rounded-full">{c.type}</span>
                  <span className="text-sm text-copper font-semibold flex items-center gap-1">⭐ {c.rating}</span>
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3 group-hover:text-olive transition-colors">{c.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-light text-sm">👥 {c.sleeps} أشخاص</span>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-olive">{c.price}</span>
                    <span className="text-sm text-charcoal-light mr-1">ر.س / ليلة</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-3 bg-olive text-white rounded-xl hover:bg-olive-dark transition-colors font-medium">
                  احجز الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works
function HowItWorks() {
  const t = useTranslations('home');
  const steps = [
    { num: '١', icon: '🔍', title: t('step1Title'), desc: t('step1Desc') },
    { num: '٢', icon: '📋', title: t('step2Title'), desc: t('step2Desc') },
    { num: '٣', icon: '🚐', title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-16">{t('howItWorks')}</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-20 h-20 bg-olive/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                {step.icon}
              </div>
              <div className="w-10 h-10 bg-copper text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-3">{step.title}</h3>
              <p className="text-charcoal-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Karfani
function WhyKarfani() {
  const t = useTranslations('home');
  const features = [
    { icon: '✅', title: t('verified'), desc: t('verifiedDesc'), color: 'olive' },
    { icon: '🛡️', title: t('protection'), desc: t('protectionDesc'), color: 'copper' },
    { icon: '📞', title: t('support247'), desc: t('support247Desc'), color: 'sand-dark' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-16">{t('whyKarfani')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-cream rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-charcoal mb-3">{f.title}</h3>
              <p className="text-charcoal-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-sand mb-4">كرفاني</h3>
            <p className="text-gray-400 leading-relaxed max-w-md">{t('description')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sand mb-4">{t('links')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">الكرفانات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المسارات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">عن كرفاني</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sand mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('privacy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          {t('copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}

// Main Page
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedCaravans />
      <HowItWorks />
      <WhyKarfani />
      <Footer />
    </main>
  );
}
