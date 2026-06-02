'use server';

import { signIn, signOut, auth } from '@/lib/auth';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@/schemas';
import type { ActionState } from '@/types';
import { AuthError } from 'next-auth';
import { userService } from '@/services';
import type { Role } from '@prisma/client';

// Login action
export async function loginAction(
  input: LoginInput
): Promise<ActionState<{ role: Role }>> {
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

    // Get the session to return the role
    const session = await auth();
    const role = session?.user?.role as Role;

    return {
      success: true,
      message: 'Login successful',
      data: { role },
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

// Register action
export async function registerAction(
  input: RegisterInput
): Promise<ActionState> {
  // Validate input
  const validatedFields = registerSchema.safeParse(input);

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

  const { name, email, password } = validatedFields.data;

  try {
    // Create user (userService handles password hashing)
    const result = await userService.create({
      name,
      email,
      password,
      role: 'USER', // Always register as USER
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Registration failed',
      };
    }

    // Auto-login after registration
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: 'Registration successful',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Something went wrong during registration',
    };
  }
}
