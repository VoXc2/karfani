'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STORAGE_KEY = 'karfani-cookies-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-[9998] p-4"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-charcoal/15 border border-cream-dark p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Text */}
              <div className="flex-1 space-y-1">
                <p className="text-sm text-charcoal leading-relaxed">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالاستمرار، أنت توافق على{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-olive font-medium underline underline-offset-2 hover:text-olive/80 transition-colors"
                  >
                    سياسة الخصوصية الخاصة بنا
                  </Link>
                  .
                </p>
                <p className="text-xs text-charcoal-light leading-relaxed">
                  We use cookies to improve your experience. By continuing, you agree to our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-olive font-medium underline underline-offset-2 hover:text-olive/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 text-sm font-medium text-charcoal border border-charcoal/20 rounded-xl hover:bg-cream transition-colors"
                >
                  رفض
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-olive rounded-xl hover:bg-olive/90 transition-colors"
                >
                  موافق
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
