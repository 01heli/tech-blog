import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('tech-blog-session');
  const { pathname } = request.nextUrl;

  // Admin routes: if no session cookie, redirect to home with login modal
  if (pathname.startsWith('/admin')) {
    if (!session?.value) {
      return NextResponse.redirect(new URL('/?login=true', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
