'use client';

import { useState } from 'react';
import { Star, Users, MapPin, Heart, ArrowLeft, Wifi, Snowflake, Flame, Zap } from 'lucide-react';
import { Link } from '../i18n/navigation';

interface CaravanCardProps {
  id: number;
  title: string;
  type: string;
  location: string;
  sleeps: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  amenities?: string[];
  featured?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  ac: <Snowflake className="w-3.5 h-3.5" />,
  heating: <Flame className="w-3.5 h-3.5" />,
  power: <Zap className="w-3.5 h-3.5" />,
};

export default function CaravanCard({
  id, title, type, location, sleeps, price, rating, reviews, image, amenities = [], featured = false,
}: CaravanCardProps) {
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <Link href={`/caravans/${id}` as any} className="group block">
      <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-charcoal/10 hover:-translate-y-2 ${
        featured ? 'ring-2 ring-copper/30' : 'shadow-sm'
      }`}>
        {/* Image */}
        <div className="relative h-56 sm:h-64 bg-gradient-to-br from-sand-light to-olive/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-700">
            {image}
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-2">
            {featured && (
              <span className="px-3 py-1 bg-copper text-white text-xs font-bold rounded-full shadow-lg">
                مميز ⭐
              </span>
            )}
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-olive text-xs font-medium rounded-full">
              {type}
            </span>
          </div>

          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`absolute top-3 end-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              liked
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/80 backdrop-blur-sm text-charcoal-light hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </button>

          {/* Price tag */}
          <div className="absolute bottom-3 start-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
            <span className="text-xl font-bold text-olive">{price.toLocaleString()}</span>
            <span className="text-xs text-charcoal-light mr-1">ر.س / ليلة</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-charcoal-light text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-copper text-copper" />
              <span className="font-semibold text-sm text-charcoal">{rating}</span>
              <span className="text-xs text-charcoal-light">({reviews})</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-charcoal group-hover:text-olive transition-colors duration-300 mb-2">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-charcoal-light mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{sleeps} أشخاص</span>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center gap-1 px-2 py-1 bg-cream rounded-lg text-xs text-charcoal-light"
                >
                  {amenityIcons[amenity] || null}
                  {amenity === 'wifi' ? 'واي فاي' :
                   amenity === 'ac' ? 'تكييف' :
                   amenity === 'heating' ? 'تدفئة' :
                   amenity === 'power' ? 'كهرباء' : amenity}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
            <span className="text-sm text-olive font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              عرض التفاصيل
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
