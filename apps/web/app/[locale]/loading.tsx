export default function Loading() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-olive/20 border-t-olive rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal-light font-medium">جاري التحميل...</p>
      </div>
    </main>
  );
}
