import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { getCorsHeaders } from '@/lib/security';

/**
 * Next.js Middleware
 * 
 * Handles:
 * 1. Admin route protection - checks authentication cookie
 * 2. CORS headers for API routes
 * 
 * Runs on every request matching the config.matcher patterns.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes protection
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check authentication
    const isAuthenticated = getAuthFromRequest(request);
    
    if (!isAuthenticated) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow authenticated access
    return NextResponse.next();
  }

  // Handle API routes - add CORS headers
  if (pathname.startsWith('/api')) {
    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
      return NextResponse.json(
        {},
        {
          status: 200,
          headers: getCorsHeaders(request),
        }
      );
    }

    // For other methods, continue with CORS headers
    const response = NextResponse.next();
    const corsHeaders = getCorsHeaders(request);
    
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specifies which routes should run through middleware
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
