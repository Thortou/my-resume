import { paymentRepository } from '@/repositories/payment.repository';
import type { DemoPaymentInput } from '@/schemas/payment.schema';
import { PRODUCT_TYPES, PRO_TEMPLATE_PRICE } from '@/schemas/payment.schema';
import type { ActionState } from '@/types';
import { Decimal } from '@prisma/client/runtime/library';

// Helper to generate transaction ID
function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
}

// Helper to detect card brand from number
function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  return 'Unknown';
}

// Helper to get last 4 digits
function getLastFourDigits(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  return cleaned.slice(-4);
}

export const paymentService = {
  // Process demo payment (simulates payment gateway)
  async processDemoPayment(
    userId: string,
    input: DemoPaymentInput
  ): Promise<ActionState<{ paymentId: string; transactionId: string }>> {
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In demo mode, always succeed
      // In production, you would integrate with a real payment gateway here
      const transactionId = generateTransactionId();
      const cardBrand = detectCardBrand(input.cardNumber);
      const cardLast4 = getLastFourDigits(input.cardNumber);

      // Create payment record
      const payment = await paymentRepository.create({
        user: { connect: { id: userId } },
        productType: input.productType,
        productId: input.productId || null,
        amount: new Decimal(input.amount),
        currency: 'LAK',
        status: 'COMPLETED',
        cardLast4,
        cardBrand,
        transactionId,
        metadata: {
          cardHolder: input.cardHolder,
          demoPayment: true,
        },
      });

      return {
        success: true,
        message: 'ການຊຳລະເງິນສຳເລັດແລ້ວ',
        data: {
          paymentId: payment.id,
          transactionId,
        },
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'ການຊຳລະເງິນລົ້ມເຫລວ. ກະລຸນາລອງໃໝ່',
      };
    }
  },

  // Check if user has access to pro templates
  async hasProTemplateAccess(userId: string): Promise<boolean> {
    return paymentRepository.hasActivePayment(
      userId,
      PRODUCT_TYPES.PRO_TEMPLATE
    );
  },

  // Check if user has access to a specific product
  async hasProductAccess(
    userId: string,
    productType: string,
    productId?: string
  ): Promise<boolean> {
    return paymentRepository.hasActivePayment(userId, productType, productId);
  },

  // Get user's payment history
  async getUserPayments(userId: string) {
    return paymentRepository.findByUserId(userId);
  },

  // Get payment by ID
  async getPaymentById(id: string) {
    return paymentRepository.findById(id);
  },

  // Get pro template price
  getProTemplatePrice() {
    return PRO_TEMPLATE_PRICE;
  },

  // Get all payments (admin)
  async getAllPayments(options?: {
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  }) {
    return paymentRepository.findAll(options);
  },
};
