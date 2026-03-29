import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'كرفاني | Karfani - Saudi Caravan Mobility & Outdoor Experience',
  description: 'منصة سعودية متخصصة لتأجير الكرفانات وتجارب السفر البري والطبيعة',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
