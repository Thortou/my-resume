import { z } from 'zod';
import { VALIDATION } from '@/constants';

// Role enum
const roleEnum = z.enum(['ADMIN', 'USER']);

// Create user schema
export const createUserSchema = z.object({
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
  role: roleEnum.default('USER'),
  image: z.string().url().optional().nullable(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Update user schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, 'Name is required')
    .max(
      VALIDATION.NAME_MAX_LENGTH,
      `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`
    )
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .max(
      VALIDATION.EMAIL_MAX_LENGTH,
      `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`
    )
    .optional(),
  password: z
    .string()
    .min(
      VALIDATION.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`
    )
    .max(
      VALIDATION.PASSWORD_MAX_LENGTH,
      `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`
    )
    .optional()
    .or(z.literal('')),
  role: roleEnum.optional(),
  image: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// User ID param schema
export const userIdSchema = z.object({
  id: z.string().cuid('Invalid user ID'),
});

export type UserIdParam = z.infer<typeof userIdSchema>;

// User list query schema
export const userListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: roleEnum.optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'role']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type UserListQuery = z.infer<typeof userListQuerySchema>;
