import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass className="w-12 h-12 text-olive animate-pulse" />
        </div>

        <h1 className="text-6xl font-bold text-olive mb-2">404</h1>
        <h2 className="text-2xl font-bold text-charcoal mb-3">الصفحة غير موجودة</h2>
        <p className="text-charcoal-light leading-relaxed mb-8">
          يبدو أنك ضللت الطريق! الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-olive/25 transition-all"
        >
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
