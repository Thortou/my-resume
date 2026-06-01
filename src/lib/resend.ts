import { Resend } from 'resend';

// Resend API client singleton
const globalForResend = globalThis as unknown as { resend: Resend | undefined };

export const resend =
  globalForResend.resend ??
  new Resend(process.env.RESEND_API_KEY);

if (process.env.NODE_ENV !== 'production') {
  globalForResend.resend = resend;
}

// Admin email for notifications
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
