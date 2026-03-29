'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface LiveBadgeProps {
  count: number;
}

export default function LiveBadge({ count }: LiveBadgeProps) {
  if (count <= 1) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cream-dark rounded-full">
      {/* Pulsing red dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
      </span>

      <span className="text-sm font-medium text-charcoal">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block tabular-nums"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        {' '}يشاهدون الآن
      </span>
    </div>
  );
}
