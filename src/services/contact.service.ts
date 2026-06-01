import type { Contact } from '@prisma/client';
import { contactRepository } from '@/repositories';
import { emailService } from '@/services/email.service';
import type { ContactInput } from '@/schemas';
import type { ActionState } from '@/types';

// Sanitize input to prevent XSS and other injection attacks
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

// Basic spam detection
function isSpam(input: ContactInput): boolean {
  const spamPatterns = [
    /\b(viagra|casino|lottery|winner|prize|click here|buy now)\b/i,
    /(http[s]?:\/\/.*){3,}/i, // Multiple URLs
    /(.)\1{10,}/i, // Repeated characters
  ];

  const combinedText = `${input.name} ${input.subject} ${input.message}`;
  return spamPatterns.some((pattern) => pattern.test(combinedText));
}

// Contact Service - Business logic layer
export const contactService = {
  // Get contact by ID
  async getById(id: string): Promise<ActionState<Contact>> {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    return {
      success: true,
      data: contact,
    };
  },

  // Get all contacts with pagination
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<
    ActionState<{
      contacts: Contact[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const result = await contactRepository.findMany(params);

    return {
      success: true,
      data: result,
    };
  },

  // Submit contact form (public)
  async submit(input: ContactInput): Promise<ActionState<Contact>> {
    // Basic spam detection
    if (isSpam(input)) {
      return {
        success: false,
        error: 'Your message was flagged as spam. Please try again.',
      };
    }

    // Sanitize inputs
    const sanitizedInput = {
      name: sanitizeInput(input.name),
      email: input.email.toLowerCase().trim(),
      phone: input.phone ? sanitizeInput(input.phone) : null,
      subject: sanitizeInput(input.subject),
      message: sanitizeInput(input.message),
    };

    // Save to database
    const contact = await contactRepository.create(sanitizedInput);

    // Send email notification to admin (fire and forget, don't fail the submission)
    emailService
      .sendContactNotification({
        ...sanitizedInput,
        submittedAt: contact.createdAt,
      })
      .catch((error) => {
        console.error('Failed to send contact notification email:', error);
      });

    return {
      success: true,
      data: contact,
      message: 'Thank you for your message! We will get back to you soon.',
    };
  },

  // Delete contact
  async delete(id: string): Promise<ActionState<Contact>> {
    const existingContact = await contactRepository.findById(id);

    if (!existingContact) {
      return {
        success: false,
        error: 'Contact not found',
      };
    }

    const contact = await contactRepository.delete(id);

    return {
      success: true,
      data: contact,
      message: 'Contact deleted successfully',
    };
  },

  // Get contact statistics
  async getStatistics(): Promise<
    ActionState<{
      total: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
    }>
  > {
    const stats = await contactRepository.getStatistics();

    return {
      success: true,
      data: stats,
    };
  },
};
