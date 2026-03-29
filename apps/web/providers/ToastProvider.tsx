'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { Toast, type ToastData, type ToastVariant } from '../components/ui/Toast';

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const contextValue: ToastContextValue = {
    success: useCallback((message: string) => addToast(message, 'success'), [addToast]),
    error: useCallback((message: string) => addToast(message, 'error'), [addToast]),
    info: useCallback((message: string) => addToast(message, 'info'), [addToast]),
    warning: useCallback((message: string) => addToast(message, 'warning'), [addToast]),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div
            className="fixed top-4 end-4 z-[9999] flex flex-col gap-3 pointer-events-auto"
            aria-live="polite"
          >
            <AnimatePresence mode="popLayout">
              {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
