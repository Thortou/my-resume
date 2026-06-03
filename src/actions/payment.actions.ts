'use server';

import { auth } from '@/lib/auth';
import { paymentService } from '@/services';
import {
  demoPaymentSchema,
  type DemoPaymentInput,
} from '@/schemas/payment.schema';
import type { ActionState } from '@/types';

// Process demo payment
export async function processDemoPaymentAction(
  input: DemoPaymentInput
): Promise<ActionState<{ paymentId: string; transactionId: string }>> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
    };
  }

  // Validate input
  const validatedFields = demoPaymentSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  return paymentService.processDemoPayment(
    session.user.id,
    validatedFields.data
  );
}

// Check if user has access to pro templates
export async function checkProTemplateAccessAction(): Promise<
  ActionState<{ hasAccess: boolean }>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: true,
      data: { hasAccess: false },
    };
  }

  const hasAccess = await paymentService.hasProTemplateAccess(session.user.id);

  return {
    success: true,
    data: { hasAccess },
  };
}

// Get pro template price info
export async function getProTemplatePriceAction(): Promise<
  ActionState<{ amount: number; currency: string; displayPrice: string }>
> {
  const price = paymentService.getProTemplatePrice();

  return {
    success: true,
    data: price,
  };
}

// Get user's payment history
export async function getUserPaymentsAction(): Promise<ActionState<unknown[]>> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ',
    };
  }

  const payments = await paymentService.getUserPayments(session.user.id);

  return {
    success: true,
    data: payments,
  };
}
