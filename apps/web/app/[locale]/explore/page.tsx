import { setRequestLocale } from 'next-intl/server';
import Navbar from '../../../components/Navbar';
import ExploreMapLoader from '../../../components/map/ExploreMapLoader';

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="h-dvh flex flex-col overflow-hidden">
      <div className="lg:hidden">
        <Navbar />
      </div>
      <ExploreMapLoader />
    </main>
  );
}
