import { hash } from 'bcryptjs';
import type { Role, User } from '@prisma/client';
import { userRepository } from '@/repositories';
import type { CreateUserInput, UpdateUserInput } from '@/schemas';
import type { ActionState } from '@/types';

// User Service - Business logic layer
export const userService = {
  // Get user by ID
  async getById(id: string): Promise<ActionState<User>> {
    const user = await userRepository.findById(id);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  },

  // Get user by email
  async getByEmail(email: string): Promise<ActionState<User>> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  },

  // Get all users with pagination
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<
    ActionState<{
      users: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const result = await userRepository.findMany(params);

    return {
      success: true,
      data: result,
    };
  },

  // Create user
  async create(input: CreateUserInput): Promise<ActionState<User>> {
    // Check if email already exists
    const emailExists = await userRepository.emailExists(input.email);

    if (emailExists) {
      return {
        success: false,
        error: 'Email already exists',
        errors: { email: ['This email is already registered'] },
      };
    }

    // Hash password
    const hashedPassword = await hash(input.password, 12);

    // Create user
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role || 'USER',
      image: input.image || null,
    });

    return {
      success: true,
      data: user,
      message: 'User created successfully',
    };
  },

  // Update user
  async update(id: string, input: UpdateUserInput): Promise<ActionState<User>> {
    // Check if user exists
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Check if email already exists (if changing email)
    if (input.email && input.email !== existingUser.email) {
      const emailExists = await userRepository.emailExists(input.email, id);

      if (emailExists) {
        return {
          success: false,
          error: 'Email already exists',
          errors: { email: ['This email is already registered'] },
        };
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.image !== undefined) updateData.image = input.image;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    // Hash password if provided
    if (input.password && input.password.length > 0) {
      updateData.password = await hash(input.password, 12);
    }

    // Update user
    const user = await userRepository.update(id, updateData);

    return {
      success: true,
      data: user,
      message: 'User updated successfully',
    };
  },

  // Delete user
  async delete(id: string): Promise<ActionState<User>> {
    // Check if user exists
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Delete user
    const user = await userRepository.delete(id);

    return {
      success: true,
      data: user,
      message: 'User deleted successfully',
    };
  },

  // Get user statistics
  async getStatistics(): Promise<
    ActionState<{
      total: number;
      admins: number;
      users: number;
      active: number;
    }>
  > {
    const stats = await userRepository.getStatistics();

    return {
      success: true,
      data: stats,
    };
  },
};
