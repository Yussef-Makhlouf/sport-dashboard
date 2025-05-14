import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the paths that should be protected
const protectedPaths = [
  '/dashboard',
  '/dashboard/news',
  '/dashboard/events',
  '/dashboard/members',
  '/dashboard/users',
  '/dashboard/profile',
  '/dashboard/settings',
];

// Define the paths that are public
const publicPaths = [
  '/login',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path should be protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If trying to access protected route without token, redirect to login
  if (isProtectedPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Add the original URL as a query parameter to redirect after login
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  
  // If trying to access login page with token, redirect to dashboard
  if (isPublicPath && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /favicon.ico, /logo3.png, etc. (static assets)
     */
    '/((?!api|_next|_static|favicon.ico|logo3.png).*)',
  ],
}; 