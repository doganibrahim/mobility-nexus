import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY ||
  process.env.JWT_SECRET ||
  'super-secret-jwt-key-change-in-production-erasmusmobility-2026';

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  'ibrahimdogan.js@gmail.com'
)
  .toLowerCase()
  .split(',')
  .map((e) => e.trim());

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 1. API Admin Protection (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    // Check API secret key header for service-to-service or internal operations
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey && adminKey.trim() === ADMIN_SECRET_KEY.trim()) {
      return NextResponse.next();
    }

    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const sessionClaims = session.sessionClaims as any;
    const role =
      sessionClaims?.metadata?.role ||
      sessionClaims?.publicMetadata?.role ||
      sessionClaims?.role;
    const email = (
      sessionClaims?.email ||
      sessionClaims?.primary_email ||
      ''
    ).toLowerCase().trim();

    // If role is explicitly standard user and email not in ADMIN_EMAILS, reject
    if (
      role &&
      !['SUPER_ADMIN', 'PLATFORM_ADMIN', 'ADMIN', 'admin'].includes(role) &&
      (!email || !ADMIN_EMAILS.includes(email))
    ) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin privileges required.' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 2. Explicit resource-based protection: protect authenticated private panels
  const isProtectedArea =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/profile');

  if (isProtectedArea) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files (including txt, xml)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
