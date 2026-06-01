import type { Role } from '@prisma/client';

// ===========================================
// API Response Types
// ===========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ===========================================
// Server Action Types
// ===========================================

export type ActionState<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

// ===========================================
// User Types
// ===========================================

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
  image?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  image?: string;
  isActive?: boolean;
}

// ===========================================
// Auth Types
// ===========================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
}

// ===========================================
// Table & Pagination Types
// ===========================================

export interface TableParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

// ===========================================
// Form Types
// ===========================================

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// ===========================================
// Navigation Types
// ===========================================

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  permissions?: string[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

// ===========================================
// Component Props Types
// ===========================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// ===========================================
// Upload Types
// ===========================================

export interface UploadedFile {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}
