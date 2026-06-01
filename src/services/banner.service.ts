import type { Banner } from '@prisma/client';
import { bannerRepository } from '@/repositories';
import type { ActionState } from '@/types';

export interface CreateBannerInput {
  title: string;
  description?: string;
  image: string;
  link?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateBannerInput {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const bannerService = {
  // Get banner by ID
  async getById(id: string): Promise<ActionState<Banner>> {
    const banner = await bannerRepository.findById(id);

    if (!banner) {
      return {
        success: false,
        error: 'Banner not found',
      };
    }

    return {
      success: true,
      data: banner,
    };
  },

  // Get all active banners (public)
  async getAllActive(): Promise<ActionState<Banner[]>> {
    const banners = await bannerRepository.findAllActive();

    return {
      success: true,
      data: banners,
    };
  },

  // Get all banners with pagination
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<
    ActionState<{
      banners: Banner[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const result = await bannerRepository.findMany(params);

    return {
      success: true,
      data: result,
    };
  },

  // Create banner
  async create(input: CreateBannerInput): Promise<ActionState<Banner>> {
    // Get next sort order if not provided
    let sortOrder = input.sortOrder;
    if (sortOrder === undefined) {
      const maxSortOrder = await bannerRepository.getMaxSortOrder();
      sortOrder = maxSortOrder + 1;
    }

    const banner = await bannerRepository.create({
      title: input.title,
      description: input.description || null,
      image: input.image,
      link: input.link || null,
      sortOrder,
      isActive: input.isActive ?? true,
    });

    return {
      success: true,
      data: banner,
      message: 'Banner created successfully',
    };
  },

  // Update banner
  async update(id: string, input: UpdateBannerInput): Promise<ActionState<Banner>> {
    const existingBanner = await bannerRepository.findById(id);

    if (!existingBanner) {
      return {
        success: false,
        error: 'Banner not found',
      };
    }

    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.image !== undefined) updateData.image = input.image;
    if (input.link !== undefined) updateData.link = input.link;
    if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    const banner = await bannerRepository.update(id, updateData);

    return {
      success: true,
      data: banner,
      message: 'Banner updated successfully',
    };
  },

  // Delete banner
  async delete(id: string): Promise<ActionState<Banner>> {
    const existingBanner = await bannerRepository.findById(id);

    if (!existingBanner) {
      return {
        success: false,
        error: 'Banner not found',
      };
    }

    const banner = await bannerRepository.delete(id);

    return {
      success: true,
      data: banner,
      message: 'Banner deleted successfully',
    };
  },

  // Get banner statistics
  async getStatistics(): Promise<ActionState<{ total: number; active: number }>> {
    const [total, active] = await Promise.all([
      bannerRepository.count(),
      bannerRepository.countActive(),
    ]);

    return {
      success: true,
      data: { total, active },
    };
  },
};
