import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ['/user/', '/owner/'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run next-intl middleware first to handle locale routing
  const response = intlMiddleware(request);

  // Extract locale from the pathname (e.g., /ar/owner/dashboard -> ar)
  const localeMatch = pathname.match(/^\/(ar|en)(\/.*)?$/);
  const locale = localeMatch?.[1] || routing.defaultLocale;
  const pathWithoutLocale = localeMatch?.[2] || '/';

  // Check if the route (without locale prefix) is protected
  const isProtectedRoute = protectedPaths.some((path) =>
    pathWithoutLocale.startsWith(path)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('karfani_access_token')?.value;

    if (!token) {
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*'],
};
