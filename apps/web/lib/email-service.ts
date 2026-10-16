/**
 * ErasmusMobility Resend Email Dispatcher
 *
 * Utilizes Resend's official REST API (zero extra package overhead).
 * Delivers an ultra-clean, minimal, and premium institutional email design.
 */

export interface ContactEmailPayload {
  trackingId: string;
  fullName: string;
  orgName: string;
  oid?: string | null;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  clientIp?: string;
  submittedAt?: string;
}

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'ErasmusMobility <info@erasmusmobility.com>';

/**
 * Hedef bildirim e-postası:
 * Ortam değişkeni CONTACT_NOTIFICATION_EMAIL tanımlıysa oraya gönderir,
 * yoksa varsayılan olarak info@erasmusmobility.com adresine gönderir.
 */
function getNotificationRecipient(): string {
  return process.env.CONTACT_NOTIFICATION_EMAIL || 'info@erasmusmobility.com';
}

/**
 * Dispatches an email via Resend REST API
 */
async function sendViaResend(params: {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      '[Resend Email] RESEND_API_KEY environment variable is not defined. Email dispatch skipped in this environment.',
    );
    return {
      success: false,
      error: 'RESEND_API_KEY is not defined in environment variables.',
    };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from || DEFAULT_FROM,
        to: Array.isArray(params.to) ? params.to : [params.to],
        reply_to: params.replyTo,
        subject: params.subject,
        html: params.html,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[Resend Email Error]', data);
      return {
        success: false,
        error: data.message || `Resend responded with HTTP ${res.status}`,
      };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('[Resend Network Error]', err);
    return { success: false, error: err?.message || 'Network request failed' };
  }
}

/**
 * Bildirim E-postası:
 * Web sitesi formundan gelen tüm mesajı sadece yetkiliye (CONTACT_NOTIFICATION_EMAIL veya info@erasmusmobility.com) iletir.
 * Kesinlikle formu dolduran üçüncü şahsa e-posta göndermez.
 */
export async function sendContactNotificationEmail(payload: ContactEmailPayload) {
  const targetRecipient = getNotificationRecipient();
  const dateStr = payload.submittedAt
    ? new Date(payload.submittedAt).toLocaleString('tr-TR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });

  const subject = `[İletişim Talebi] ${payload.orgName} - ${payload.subject || 'Genel Başvuru'} (Ref: #${payload.trackingId})`;

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <div style="max-width: 600px; margin: 36px auto; padding: 0 16px;">
    
    <!-- Top Brand Wordmark -->
    <div style="margin-bottom: 16px; padding: 0 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #003399;">
              🇪🇺 ERASMUS MOBILITY
            </span>
          </td>
          <td align="right">
            <span style="font-size: 11px; font-weight: 600; color: #64748b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
              #${payload.trackingId}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 10px -2px rgba(15, 23, 42, 0.04);">
      
      <!-- Card Header -->
      <div style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
        <h1 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">
          Yeni İletişim & Danışmanlık Talebi
        </h1>
        <p style="margin: 0; font-size: 13.5px; color: #64748b; line-height: 1.5;">
          Web sitesi iletişim formu üzerinden yeni bir kurum başvurusu alındı.
        </p>
      </div>

      <!-- Card Body -->
      <div style="padding: 28px 32px;">
        
        <!-- Key Metadata Grid -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #fafbfc;">
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; width: 34%; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              Gönderen
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13.5px; font-weight: 600; color: #0f172a;">
              ${payload.fullName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              Kurum / Okul
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13.5px; font-weight: 600; color: #0f172a;">
              ${payload.orgName}
            </td>
          </tr>
          ${
            payload.oid
              ? `
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              Erasmus OID
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13px; font-weight: 700; color: #1d4ed8; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
              ${payload.oid}
            </td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              E-posta
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13.5px;">
              <a href="mailto:${payload.email}" style="color: #2563eb; font-weight: 600; text-decoration: none;">
                ${payload.email}
              </a>
            </td>
          </tr>
          ${
            payload.phone
              ? `
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              Telefon
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13.5px; color: #0f172a; font-weight: 500;">
              <a href="tel:${payload.phone}" style="color: #0f172a; text-decoration: none;">
                ${payload.phone}
              </a>
            </td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              Talep Konusu
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13.5px; font-weight: 600; color: #0f172a;">
              ${payload.subject || 'Genel Başvuru & Danışmanlık'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #64748b;">
              Kayıt Tarihi
            </td>
            <td style="padding: 12px 16px; font-size: 12.5px; color: #64748b;">
              ${dateStr}
            </td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="margin-bottom: 28px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; margin-bottom: 8px;">
            Mesaj
          </div>
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-left: 3px solid #0f172a; border-radius: 6px; padding: 18px 20px; font-size: 14px; line-height: 1.65; color: #1e293b; white-space: pre-wrap;">${payload.message}</div>
        </div>

        <!-- Call to Action -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <a href="mailto:${payload.email}?subject=Re: ${encodeURIComponent(payload.subject || 'Erasmus İletişim Talebi')} (#${payload.trackingId})" 
                 style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.01em;">
                Göndericiyi Yanıtla (${payload.email})
              </a>
              <div style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
                Doğrudan bu e-postaya "Yanıtla" (Reply) diyerek de göndericiye ulaşabilirsiniz.
              </div>
            </td>
          </tr>
        </table>

      </div>

      <!-- Card Footer -->
      <div style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 16px 32px; font-size: 11.5px; color: #64748b; line-height: 1.5; text-align: center;">
        ErasmusMobility İletişim Masası • IP: ${payload.clientIp || 'Güvenli İstemci'} • Alan Adı: <span style="color: #0f172a; font-weight: 600;">erasmusmobility.com</span>
      </div>

    </div>

    <!-- Outer Subtitle -->
    <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">
      © ${new Date().getFullYear()} ErasmusMobility. Tüm hakları saklıdır.
    </div>

  </div>
</body>
</html>
  `;

  return sendViaResend({
    from: DEFAULT_FROM,
    to: targetRecipient,
    replyTo: payload.email,
    subject,
    html,
  });
}
