//C:\Users\yc\rsvp-invite\src\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('dashboardToken')?.value;

  const envToken = process.env.DASHBOARD_TOKEN || 'demo-token-123';

  // אם מנסים לגשת ל־/dashboard בלי טוקן נכון – מפנה לדף הראשי
  if (req.nextUrl.pathname.startsWith('/dashboard') && token !== envToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
