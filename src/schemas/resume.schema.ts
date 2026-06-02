import { z } from 'zod';

// Language entry schema
const languageEntrySchema = z.object({
  name: z.string().min(1, 'Language name is required'),
  level: z.string().min(1, 'Proficiency level is required'),
});

// Experience entry schema
const experienceEntrySchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Education entry schema
const educationEntrySchema = z.object({
  school: z.string().min(1, 'School name is required'),
  degree: z.string().min(1, 'Degree is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Create resume schema
export const createResumeSchema = z.object({
  title: z
    .string()
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters'),
  jobTitle: z
    .string()
    .max(100, 'Job title must be less than 100 characters')
    .optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  photoUrl: z.string().optional(),
  objective: z
    .string()
    .max(1000, 'Objective must be less than 1000 characters')
    .optional(),
  skills: z.array(z.string()).optional().default([]),
  languages: z.array(languageEntrySchema).optional().default([]),
  experience: z.array(experienceEntrySchema).optional().default([]),
  education: z.array(educationEntrySchema).optional().default([]),
  templateId: z.string().optional().default('professional'),
  isPublic: z.boolean().optional().default(false),
});

export type CreateResumeInput = z.input<typeof createResumeSchema>;
export type CreateResumeOutput = z.output<typeof createResumeSchema>;

// Update resume schema
export const updateResumeSchema = z.object({
  title: z
    .string()
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
  jobTitle: z
    .string()
    .max(100, 'Job title must be less than 100 characters')
    .optional()
    .nullable(),
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .nullable(),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .nullable(),
  website: z
    .string()
    .url('Invalid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url('Invalid LinkedIn URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  photoUrl: z.string().optional().nullable(),
  objective: z
    .string()
    .max(1000, 'Objective must be less than 1000 characters')
    .optional()
    .nullable(),
  skills: z.array(z.string()).optional(),
  languages: z.array(languageEntrySchema).optional(),
  experience: z.array(experienceEntrySchema).optional(),
  education: z.array(educationEntrySchema).optional(),
  templateId: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;

// Resume ID param schema
export const resumeIdSchema = z.object({
  id: z.string().cuid('Invalid resume ID'),
});

export type ResumeIdParam = z.infer<typeof resumeIdSchema>;

// Resume slug param schema
export const resumeSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export type ResumeSlugParam = z.infer<typeof resumeSlugSchema>;

// Resume list query schema
export const resumeListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(['title', 'fullName', 'createdAt', 'updatedAt'])
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ResumeListQuery = z.infer<typeof resumeListQuerySchema>;
