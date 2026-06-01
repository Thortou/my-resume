import { resend, ADMIN_EMAIL } from '@/lib/resend';
import { ContactEmailTemplate } from '@/templates/contact-email';
import type { ActionState } from '@/types';

export interface SendContactEmailParams {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  submittedAt: Date;
}

// Email Service - Handles all email sending operations
export const emailService = {
  // Send contact form notification email to admin
  async sendContactNotification(
    params: SendContactEmailParams
  ): Promise<ActionState<{ id: string }>> {
    try {
      const { name, email, phone, subject, message, submittedAt } = params;

      const { data, error } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `New Contact: ${subject}`,
        react: ContactEmailTemplate({
          name,
          email,
          phone,
          subject,
          message,
          submittedAt,
        }),
      });

      if (error) {
        console.error('Failed to send contact notification email:', error);
        return {
          success: false,
          error: 'Failed to send email notification',
        };
      }

      return {
        success: true,
        data: { id: data?.id || '' },
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while sending email',
      };
    }
  },
};
