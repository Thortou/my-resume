import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

/**
 * Edge-compatible middleware
 *
 * IMPORTANT: This file must NOT import from '@/lib/auth' directly
 * as that would bundle Prisma (~800KB+) into the Edge Function.
 *
 * Instead, we import only the Edge-compatible authConfig which contains:
 * - JWT session strategy
 * - Callbacks for token/session handling
 * - No database clients or Node.js-only libraries
 */

// Create auth instance for middleware (Edge-compatible)
const { auth } = NextAuth(authConfig);

// Routes that require authentication (any authenticated user)
const authenticatedRoutes = ['/chat'];

// Routes that require admin authentication
const protectedRoutes = ['/admin'];

// Routes that should redirect authenticated users
const authRoutes = ['/login'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthenticatedRoute = authenticatedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(
    (route) => nextUrl.pathname === route
  );

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    // Redirect admin users to admin dashboard
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    // Redirect regular users to home
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // Protect authenticated routes (any logged-in user can access)
  if (isAuthenticatedRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes
  if (isProtectedRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
