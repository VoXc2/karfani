import { setRequestLocale } from 'next-intl/server';
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
      <Navbar />
      <HeroSection />
      <FeaturedCaravans />
      <DestinationsSection />
      <HowItWorks />
      <WhyKarfani />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
