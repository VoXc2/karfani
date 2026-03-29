'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
}

const variantStyles: Record<ToastVariant, { bg: string; border: string; text: string; progress: string }> = {
  success: {
    bg: 'bg-[#4A5D3A]',
    border: 'border-[#4A5D3A]/30',
    text: 'text-white',
    progress: 'bg-white/40',
  },
  error: {
    bg: 'bg-red-600',
    border: 'border-red-600/30',
    text: 'text-white',
    progress: 'bg-white/40',
  },
  info: {
    bg: 'bg-blue-600',
    border: 'border-blue-600/30',
    text: 'text-white',
    progress: 'bg-white/40',
  },
  warning: {
    bg: 'bg-[#C67B3C]',
    border: 'border-[#C67B3C]/30',
    text: 'text-white',
    progress: 'bg-white/40',
  },
};

const DISMISS_DURATION = 4000;

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const styles = variantStyles[toast.variant];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DISMISS_DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`relative overflow-hidden rounded-xl shadow-lg ${styles.bg} ${styles.text} min-w-[300px] max-w-[420px]`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
        <button
          onClick={() => onClose(toast.id)}
          className="shrink-0 rounded-lg p-1 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-black/10">
        <motion.div
          className={`h-full ${styles.progress}`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
