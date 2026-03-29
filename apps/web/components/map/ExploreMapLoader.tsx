'use client';

import dynamic from 'next/dynamic';

const ExploreMap = dynamic(() => import('./ExploreMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100dvh-80px)] lg:h-dvh flex items-center justify-center bg-cream">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-olive/10 flex items-center justify-center animate-pulse">
          <span className="text-3xl">🗺️</span>
        </div>
        <p className="text-charcoal-light font-medium">جاري تحميل الخريطة...</p>
      </div>
    </div>
  ),
});

export default function ExploreMapLoader() {
  return <ExploreMap />;
}
