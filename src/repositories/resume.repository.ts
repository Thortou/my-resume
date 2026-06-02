import type { Prisma, Resume } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface ResumeFindManyParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ResumeFindManyResult {
  resumes: Resume[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const resumeRepository = {
  // Find resume by ID
  async findById(id: string): Promise<Resume | null> {
    return prisma.resume.findUnique({
      where: { id },
    });
  },

  // Find resume by slug
  async findBySlug(slug: string): Promise<Resume | null> {
    return prisma.resume.findUnique({
      where: { slug },
    });
  },

  // Find all resumes by user ID
  async findByUserId(userId: string): Promise<Resume[]> {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  },

  // Find public resume by slug
  async findPublicBySlug(slug: string): Promise<Resume | null> {
    return prisma.resume.findFirst({
      where: {
        slug,
        isPublic: true,
      },
    });
  },

  // Find many resumes with pagination and filters
  async findMany(params: ResumeFindManyParams): Promise<ResumeFindManyResult> {
    const {
      page = 1,
      limit = 10,
      search,
      userId,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ResumeWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.resume.count({ where }),
    ]);

    return {
      resumes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Create resume
  async create(data: Prisma.ResumeCreateInput): Promise<Resume> {
    return prisma.resume.create({ data });
  },

  // Update resume
  async update(id: string, data: Prisma.ResumeUpdateInput): Promise<Resume> {
    return prisma.resume.update({
      where: { id },
      data,
    });
  },

  // Delete resume
  async delete(id: string): Promise<Resume> {
    return prisma.resume.delete({
      where: { id },
    });
  },

  // Check if slug exists
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const resume = await prisma.resume.findFirst({
      where: {
        slug,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return !!resume;
  },

  // Count resumes by user
  async countByUserId(userId: string): Promise<number> {
    return prisma.resume.count({ where: { userId } });
  },
};
