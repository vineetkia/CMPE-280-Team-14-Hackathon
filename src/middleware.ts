import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicPaths = ['/login', '/register'];
const publicApiPaths = ['/api/auth/login', '/api/auth/register', '/api/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public pages
  if (publicPaths.some(p => pathname === p)) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (publicApiPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth token cookie
  const token = request.cookies.get('studypilot_token')?.value;

  if (!token) {
    // API routes return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Page routes redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and visits login/register, redirect to dashboard
  if (publicPaths.some(p => pathname === p)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
