import { setRequestLocale } from 'next-intl/server';
import JsonLd from '../../components/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '../../lib/structured-data';
import RecentBookingsTicker from '../../components/RecentBookingsTicker';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FeaturedCaravans from '../../components/FeaturedCaravans';
import HowItWorks from '../../components/HowItWorks';
import DestinationsSection from '../../components/DestinationsSection';
import WhyKarfani from '../../components/WhyKarfani';
import TestimonialsSection from '../../components/TestimonialsSection';
import CTASection from '../../components/CTASection';
import Footer from '../../components/Footer';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="overflow-hidden">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Navbar />
      <HeroSection />
      <FeaturedCaravans />
      <DestinationsSection />
      <HowItWorks />
      <WhyKarfani />
      <TestimonialsSection />
      <CTASection />
      <RecentBookingsTicker />
      <Footer />
    </main>
  );
}
