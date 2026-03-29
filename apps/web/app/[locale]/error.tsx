'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-copper/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-copper" />
        </div>

        <h1 className="text-3xl font-bold text-charcoal mb-3">حدث خطأ</h1>
        <p className="text-charcoal-light leading-relaxed mb-8">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            حاول مرة أخرى
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 border border-cream-dark text-charcoal rounded-2xl font-semibold hover:bg-white transition-all"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </main>
  );
}
