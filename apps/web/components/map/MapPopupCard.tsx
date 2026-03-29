'use client';

import { Star, Users, MapPin, X, ArrowLeft, Navigation, Route, Tent } from 'lucide-react';
import { Link } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';

interface MapLocation {
  id: string;
  type: 'caravan' | 'campsite' | 'route' | 'hub';
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  price?: number;
  rating?: number;
  reviews?: number;
  image: string;
  sleeps?: number;
  amenities?: string[];
  difficulty?: string;
}

const difficultyLabels: Record<string, { label: string; color: string }> = {
  EASY: { label: 'سهل', color: 'bg-green-100 text-green-700' },
  MODERATE: { label: 'متوسط', color: 'bg-amber-100 text-amber-700' },
  CHALLENGING: { label: 'صعب', color: 'bg-orange-100 text-orange-700' },
  EXPERT: { label: 'خبير', color: 'bg-red-100 text-red-700' },
};

export default function MapPopupCard({
  location,
  onClose,
}: {
  location: MapLocation;
  onClose: () => void;
}) {
  const t = useTranslations('explore');

  const isCaravan = location.type === 'caravan';
  const isCampsite = location.type === 'campsite';
  const isRoute = location.type === 'route';

  const detailHref = isCaravan
    ? `/caravans/${location.id}`
    : isRoute
      ? `/routes/${location.id}`
      : '#';

  return (
    <div className="absolute bottom-20 inset-x-4 sm:start-auto sm:end-4 sm:bottom-20 sm:w-96 z-40 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl shadow-charcoal/20 overflow-hidden border border-cream-dark">
        {/* Image / Emoji Banner */}
        <div className="relative h-40 bg-gradient-to-br from-sand-light/60 via-olive/10 to-copper/20 flex items-center justify-center overflow-hidden">
          <span className="text-7xl">{location.image}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 end-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-charcoal" />
          </button>

          {/* Type Badge */}
          <div className="absolute top-3 start-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
              isCaravan ? 'bg-olive text-white' :
              isCampsite ? 'bg-amber-500 text-white' :
              isRoute ? 'bg-copper text-white' :
              'bg-charcoal text-white'
            }`}>
              {isCaravan ? '🚐 ' + t('caravan') :
               isCampsite ? '⛺ ' + t('campsite') :
               isRoute ? '🗺️ ' + t('route') :
               '📍 ' + t('hub')}
            </span>
          </div>

          {/* Price (bottom right of banner) */}
          {location.price && isCaravan && (
            <div className="absolute bottom-3 start-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
              <span className="text-lg font-bold text-olive">{location.price.toLocaleString()}</span>
              <span className="text-xs text-charcoal-light ms-1">ر.س / ليلة</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-charcoal leading-snug">{location.title}</h3>
              <div className="flex items-center gap-1.5 text-charcoal-light text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{location.subtitle}</span>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-3">
            {location.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-copper text-copper" />
                <span className="font-semibold text-sm text-charcoal">{location.rating}</span>
                {location.reviews && (
                  <span className="text-xs text-charcoal-light">({location.reviews})</span>
                )}
              </div>
            )}
            {location.sleeps && (
              <div className="flex items-center gap-1 text-sm text-charcoal-light">
                <Users className="w-4 h-4" />
                <span>{location.sleeps} {t('persons')}</span>
              </div>
            )}
            {location.difficulty && difficultyLabels[location.difficulty] && (() => {
              const dl = difficultyLabels[location.difficulty!]!;
              return (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${dl.color}`}>
                  {dl.label}
                </span>
              );
            })()}
            {isCampsite && location.price && (
              <div className="text-sm text-charcoal-light">
                <span className="font-semibold text-olive">{location.price}</span> ر.س / ليلة
              </div>
            )}
          </div>

          {/* Amenities */}
          {location.amenities && location.amenities.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {location.amenities.map((a) => (
                <span key={a} className="px-2 py-1 bg-cream rounded-lg text-xs text-charcoal-light font-medium">
                  {a === 'wifi' ? '📶 واي فاي' : a === 'ac' ? '❄️ تكييف' : a === 'power' ? '⚡ كهرباء' : a}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            {(isCaravan || isRoute) && (
              <Link
                href={detailHref as any}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-copper to-copper-light text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-copper/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isCaravan ? t('viewDetails') : t('viewRoute')}
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </Link>
            )}
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
                window.open(url, '_blank');
              }}
              className="w-11 h-11 border border-olive text-olive rounded-xl flex items-center justify-center hover:bg-olive hover:text-white transition-all shrink-0"
            >
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
