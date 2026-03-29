import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '../../i18n/routing';
import QueryProvider from '../../providers/QueryProvider';
import AuthProvider from '../../providers/AuthProvider';
import { ToastProvider } from '../../providers/ToastProvider';
import CookieConsent from '../../components/CookieConsent';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta name="theme-color" content="#4A5D3A" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-charcoal antialiased">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AuthProvider>
          </QueryProvider>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
