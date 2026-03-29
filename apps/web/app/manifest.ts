import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'كرفاني - منصة تأجير الكرفانات',
    short_name: 'كرفاني',
    description: 'المنصة الأولى لتأجير الكرفانات في السعودية',
    start_url: '/ar',
    display: 'standalone',
    background_color: '#FAF6F0',
    theme_color: '#4A5D3A',
    orientation: 'portrait',
    dir: 'rtl',
    lang: 'ar',
    categories: ['travel', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
