'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const names = [
  'أحمد', 'محمد', 'عبدالله', 'سلطان', 'فهد',
  'خالد', 'سارة', 'نورة', 'ريم', 'لمى',
];

const cities = [
  'الرياض', 'جدة', 'العلا', 'عسير', 'الباحة',
  'حائل', 'تبوك', 'الطائف', 'أملج', 'جازان',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function generateBooking() {
  return `${randomItem(names)} حجز كرفان في ${randomItem(cities)}`;
}

export default function RecentBookingsTicker() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [started, setStarted] = useState(false);

  const showNotification = useCallback(() => {
    setMessage(generateBooking());
    setVisible(true);

    // Hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return hideTimer;
  }, []);

  // Delay start by 5 seconds
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStarted(true);
    }, 5000);
    return () => clearTimeout(delayTimer);
  }, []);

  // Cycle notifications every 8-12 seconds once started
  useEffect(() => {
    if (!started) return;

    let hideTimer: ReturnType<typeof setTimeout>;

    function schedule() {
      const interval = 8000 + Math.random() * 4000; // 8-12 seconds
      return setTimeout(() => {
        hideTimer = showNotification();
        scheduleTimer = schedule();
      }, interval);
    }

    // Show the first one immediately when started
    hideTimer = showNotification();
    let scheduleTimer = schedule();

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(scheduleTimer);
    };
  }, [started, showNotification]);

  return (
    <div className="fixed bottom-4 start-4 z-50 pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto bg-white rounded-xl shadow-lg shadow-charcoal/10 border border-cream-dark px-4 py-3 flex items-center gap-3 max-w-xs"
          >
            <span className="w-8 h-8 bg-olive/10 rounded-lg flex items-center justify-center text-olive text-sm shrink-0">
              🏕️
            </span>
            <div>
              <p className="text-sm font-medium text-charcoal leading-snug">{message}</p>
              <p className="text-xs text-charcoal-light mt-0.5">الآن</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
