import { z } from 'zod';
import { VALIDATION } from '@/constants';

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(
      VALIDATION.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(VALIDATION.NAME_MIN_LENGTH, 'Name is required')
      .max(
        VALIDATION.NAME_MAX_LENGTH,
        `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email')
      .max(
        VALIDATION.EMAIL_MAX_LENGTH,
        `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`
      ),
    password: z
      .string()
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
      )
      .max(
        VALIDATION.PASSWORD_MAX_LENGTH,
        `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `New password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
      )
      .max(
        VALIDATION.PASSWORD_MAX_LENGTH,
        `New password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
