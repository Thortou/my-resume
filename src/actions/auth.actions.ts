'use server';

import { signIn, signOut } from '@/lib/auth';
import { loginSchema, type LoginInput } from '@/schemas';
import type { ActionState } from '@/types';
import { AuthError } from 'next-auth';

// Login action
export async function loginAction(input: LoginInput): Promise<ActionState> {
  // Validate input
  const validatedFields = loginSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            error: 'Invalid email or password',
          };
        default:
          return {
            success: false,
            error: 'Something went wrong',
          };
      }
    }

    throw error;
  }
}

// Logout action
export async function logoutAction(): Promise<ActionState> {
  try {
    await signOut({ redirect: false });

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch {
    return {
      success: false,
      error: 'Failed to logout',
    };
  }
}
