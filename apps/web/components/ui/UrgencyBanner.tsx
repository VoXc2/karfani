'use client';

import { motion } from 'framer-motion';

interface UrgencyBannerProps {
  availableDates?: number;
  lastBooked?: string;
}

export default function UrgencyBanner({ availableDates, lastBooked }: UrgencyBannerProps) {
  if (!availableDates && !lastBooked) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200/60 rounded-xl text-sm">
        {availableDates !== undefined && (
          <span className="text-amber-800 font-medium">
            ⚡ باقي {availableDates} أيام متاحة هذا الشهر
          </span>
        )}
        {availableDates !== undefined && lastBooked && (
          <span className="text-amber-300">|</span>
        )}
        {lastBooked && (
          <span className="text-amber-700">
            🔥 تم حجزه {lastBooked}
          </span>
        )}
      </div>
    </motion.div>
  );
}
