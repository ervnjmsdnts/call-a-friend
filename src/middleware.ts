import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  if ((pathname.startsWith('/c') || pathname.startsWith('/s')) && !session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/auth/assign-role', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};
