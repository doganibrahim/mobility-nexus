import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeInput, isValidEmail, isValidOid } from '@/lib/sanitize';
import { recordAuditEvent } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'contact_messages.json');

async function saveContactMessage(msg: Record<string, any>) {
  try {
    let existing: any[] = [];
    try {
      const fileData = await fs.readFile(MESSAGES_FILE, 'utf-8');
      existing = JSON.parse(fileData);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
    }
    existing.unshift(msg);
    // Keep last 100 messages in file storage
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(existing.slice(0, 100), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist contact message to file:', err);
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // 1. Rate Limiting: Max 5 submissions per IP every 10 minutes (600,000 ms)
  const rateLimitResult = checkRateLimit(`contact:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimitResult.allowed) {
    recordAuditEvent('RATE_LIMIT_EXCEEDED', {
      clientIp,
      userAgent,
      status: 'WARNING',
      details: { endpoint: '/api/contact', remaining: rateLimitResult.remaining },
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyip tekrar deneyin.',
        resetTime: rateLimitResult.resetTime,
      },
      { status: 429 },
    );
  }

  try {
    const rawBody = await request.json().catch(() => ({}));

    // 2. Honeypot Trap: Real users leave this invisible field empty
    const honeypot = rawBody.website || rawBody.hp_field || rawBody.company_trap;
    if (honeypot && String(honeypot).trim().length > 0) {
      recordAuditEvent('CONTACT_SPAM_BLOCKED', {
        clientIp,
        userAgent,
        status: 'WARNING',
        details: { reason: 'Honeypot field triggered', honeypotValue: honeypot },
      });

      // Return synthetic success to confuse automated bot networks without saving spam
      return NextResponse.json({
        success: true,
        message: 'Mesajınız başarıyla kaydedildi.',
      });
    }

    // 3. Time-trap check: Forms submitted faster than 2 seconds are automated bots
    const formLoadedAt = Number(rawBody.formLoadedAt);
    if (formLoadedAt && Date.now() - formLoadedAt < 1800) {
      recordAuditEvent('CONTACT_SPAM_BLOCKED', {
        clientIp,
        userAgent,
        status: 'WARNING',
        details: {
          reason: 'Time-trap triggered (submitted in <1.8s)',
          elapsedMs: Date.now() - formLoadedAt,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Mesajınız başarıyla kaydedildi.',
      });
    }

    // 4. Input Sanitization
    const fullName = sanitizeInput(rawBody.fullName);
    const orgName = sanitizeInput(rawBody.orgName);
    const oid = sanitizeInput(rawBody.oid);
    const email = sanitizeInput(rawBody.email).toLowerCase();
    const phone = sanitizeInput(rawBody.phone);
    const subject = sanitizeInput(rawBody.subject);
    const message = sanitizeInput(rawBody.message);

    // 5. Strict Field Validation
    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir ad soyad giriniz (2-100 karakter).' },
        { status: 400 },
      );
    }

    if (!orgName || orgName.length < 2 || orgName.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir kurum adı giriniz (2-150 karakter).' },
        { status: 400 },
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir kurumsal e-posta adresi giriniz.' },
        { status: 400 },
      );
    }

    if (!message || message.length < 10 || message.length > 3000) {
      return NextResponse.json(
        { success: false, error: 'Mesajınız en az 10, en fazla 3000 karakter olmalıdır.' },
        { status: 400 },
      );
    }

    if (oid && !isValidOid(oid)) {
      // Optional check, non-blocking but cleaned
    }

    // 6. Generate Official Tracking Reference ID
    const trackingId = `MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 7. Persist Message to Local Store
    await saveContactMessage({
      id: trackingId,
      submittedAt: new Date().toISOString(),
      fullName,
      orgName,
      oid: oid || null,
      email,
      phone: phone || null,
      subject,
      message,
      clientIp,
      status: 'UNREAD',
    });

    // 8. Record Audit Log for Valid Submission
    recordAuditEvent('CONTACT_FORM_SUBMISSION', {
      actorEmail: email,
      clientIp,
      userAgent,
      status: 'SUCCESS',
      details: {
        trackingId,
        fullName,
        orgName,
        subject,
        oid: oid || undefined,
        messageLength: message.length,
      },
    });

    return NextResponse.json({
      success: true,
      trackingId,
      message: 'Mesajınız başarıyla iletildi. Uzman ekibimiz en kısa sürede dönüş sağlayacaktır.',
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Mesajınız iletilirken bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 },
    );
  }
}
