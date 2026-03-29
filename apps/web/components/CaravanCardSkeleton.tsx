'use client';

import { Skeleton } from './ui/Skeleton';

export default function CaravanCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Image area */}
      <Skeleton className="h-56 sm:h-64 rounded-none" />

      {/* Content */}
      <div className="p-5">
        {/* Location + rating row */}
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Capacity line */}
        <Skeleton className="h-4 w-24 mb-3" />

        {/* Amenities row - 4 small pills */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-14 rounded-lg" />
        </div>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
