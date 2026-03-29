import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'كرفاني - لوحة التحكم',
  description: 'لوحة التشغيل والإدارة لمنصة كرفاني',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-charcoal antialiased">
        <Sidebar />
        <div className="ms-64 min-h-screen transition-all duration-300">
          {children}
        </div>
      </body>
    </html>
  );
}
