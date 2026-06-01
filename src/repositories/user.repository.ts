import type { Prisma, Role, User } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface UserFindManyParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFindManyResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Repository - Data access layer
export const userRepository = {
  // Find user by ID
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  // Find many users with pagination and filters
  async findMany(params: UserFindManyParams): Promise<UserFindManyResult> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    // Execute queries in parallel
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Create user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  // Update user
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  // Delete user
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  // Check if email exists (excluding specific user)
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
    return !!user;
  },

  // Count users by role
  async countByRole(role: Role): Promise<number> {
    return prisma.user.count({
      where: { role },
    });
  },

  // Get user statistics
  async getStatistics(): Promise<{
    total: number;
    admins: number;
    users: number;
    active: number;
  }> {
    const [total, admins, users, active] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return { total, admins, users, active };
  },
};
