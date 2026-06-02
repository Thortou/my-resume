import type { Resume } from '@prisma/client';
import { resumeRepository } from '@/repositories/resume.repository';
import type { ActionState } from '@/types';
import type { ResumeData } from '@/types/resume';

// Helper to remove null bytes from strings (PostgreSQL UTF-8 compatibility)
function sanitizeString(str: string | null | undefined): string | null {
  if (str == null) return null;
  // Remove null bytes and other problematic characters
  return str.replace(/\x00/g, '');
}

// Helper to sanitize all strings in an object recursively
function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return sanitizeString(data) as T;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item)) as T;
  }
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeData(value);
    }
    return result as T;
  }
  return data;
}

// Helper to generate a unique slug
function generateSlug(fullName: string): string {
  const base = sanitizeString(fullName)!
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

// Helper to transform Resume to ResumeData
function toResumeData(resume: Resume): ResumeData {
  return {
    id: resume.id,
    title: resume.title,
    slug: resume.slug,
    fullName: resume.fullName,
    jobTitle: resume.jobTitle,
    email: resume.email,
    phone: resume.phone,
    address: resume.address,
    website: resume.website,
    linkedin: resume.linkedin,
    photoUrl: resume.photoUrl,
    objective: resume.objective,
    skills: (resume.skills as string[]) || [],
    languages: (resume.languages as { name: string; level: string }[]) || [],
    experience:
      (resume.experience as {
        company: string;
        role: string;
        startDate: string;
        endDate?: string;
        description?: string;
      }[]) || [],
    education:
      (resume.education as {
        school: string;
        degree: string;
        startDate: string;
        endDate?: string;
        description?: string;
      }[]) || [],
    templateId: resume.templateId,
    isPublic: resume.isPublic,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  };
}

export interface CreateResumeServiceInput {
  userId: string;
  title?: string;
  fullName: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  photoUrl?: string;
  objective?: string;
  skills?: string[];
  languages?: { name: string; level: string }[];
  experience?: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    school: string;
    degree: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  templateId?: string;
  isPublic?: boolean;
}

export interface UpdateResumeServiceInput {
  title?: string;
  fullName?: string;
  jobTitle?: string | null;
  email?: string;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  linkedin?: string | null;
  photoUrl?: string | null;
  objective?: string | null;
  skills?: string[];
  languages?: { name: string; level: string }[];
  experience?: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    school: string;
    degree: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  templateId?: string;
  isPublic?: boolean;
}

export const resumeService = {
  // Get resume by ID
  async getById(id: string): Promise<ActionState<ResumeData>> {
    const resume = await resumeRepository.findById(id);

    if (!resume) {
      return {
        success: false,
        error: 'Resume not found',
      };
    }

    return {
      success: true,
      data: toResumeData(resume),
    };
  },

  // Get resume by ID with ownership check
  async getByIdForUser(
    id: string,
    userId: string
  ): Promise<ActionState<ResumeData>> {
    const resume = await resumeRepository.findById(id);

    if (!resume) {
      return {
        success: false,
        error: 'Resume not found',
      };
    }

    if (resume.userId !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    return {
      success: true,
      data: toResumeData(resume),
    };
  },

  // Get public resume by slug
  async getPublicBySlug(slug: string): Promise<ActionState<ResumeData>> {
    const resume = await resumeRepository.findPublicBySlug(slug);

    if (!resume) {
      return {
        success: false,
        error: 'Resume not found or not public',
      };
    }

    return {
      success: true,
      data: toResumeData(resume),
    };
  },

  // Get all resumes for a user
  async getAllByUserId(userId: string): Promise<ActionState<ResumeData[]>> {
    const resumes = await resumeRepository.findByUserId(userId);

    return {
      success: true,
      data: resumes.map(toResumeData),
    };
  },

  // Get all resumes with pagination
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<
    ActionState<{
      resumes: ResumeData[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    const result = await resumeRepository.findMany(params);

    return {
      success: true,
      data: {
        ...result,
        resumes: result.resumes.map(toResumeData),
      },
    };
  },

  // Create resume
  async create(
    input: CreateResumeServiceInput
  ): Promise<ActionState<ResumeData>> {
    // Generate unique slug
    let slug = generateSlug(input.fullName);
    let attempts = 0;
    while (await resumeRepository.slugExists(slug)) {
      slug = generateSlug(input.fullName);
      attempts++;
      if (attempts > 10) {
        return {
          success: false,
          error: 'Failed to generate unique slug',
        };
      }
    }

    // Sanitize input to remove null bytes (PostgreSQL UTF-8 compatibility)
    const sanitizedInput = sanitizeData(input);

    const resume = await resumeRepository.create({
      user: { connect: { id: sanitizedInput.userId } },
      title: sanitizedInput.title || 'My Resume',
      slug,
      fullName: sanitizedInput.fullName,
      jobTitle: sanitizedInput.jobTitle || null,
      email: sanitizedInput.email,
      phone: sanitizedInput.phone || null,
      address: sanitizedInput.address || null,
      website: sanitizedInput.website || null,
      linkedin: sanitizedInput.linkedin || null,
      photoUrl: sanitizedInput.photoUrl || null,
      objective: sanitizedInput.objective || null,
      skills: sanitizedInput.skills || [],
      languages: sanitizedInput.languages || [],
      experience: sanitizedInput.experience || [],
      education: sanitizedInput.education || [],
      templateId: sanitizedInput.templateId || 'professional',
      isPublic: sanitizedInput.isPublic ?? false,
    });

    return {
      success: true,
      data: toResumeData(resume),
      message: 'Resume created successfully',
    };
  },

  // Update resume
  async update(
    id: string,
    userId: string,
    input: UpdateResumeServiceInput
  ): Promise<ActionState<ResumeData>> {
    const existingResume = await resumeRepository.findById(id);

    if (!existingResume) {
      return {
        success: false,
        error: 'Resume not found',
      };
    }

    if (existingResume.userId !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    // Sanitize input to remove null bytes (PostgreSQL UTF-8 compatibility)
    const sanitizedInput = sanitizeData(input);

    const updateData: Record<string, unknown> = {};

    if (sanitizedInput.title !== undefined)
      updateData.title = sanitizedInput.title;
    if (sanitizedInput.fullName !== undefined)
      updateData.fullName = sanitizedInput.fullName;
    if (sanitizedInput.jobTitle !== undefined)
      updateData.jobTitle = sanitizedInput.jobTitle;
    if (sanitizedInput.email !== undefined)
      updateData.email = sanitizedInput.email;
    if (sanitizedInput.phone !== undefined)
      updateData.phone = sanitizedInput.phone;
    if (sanitizedInput.address !== undefined)
      updateData.address = sanitizedInput.address;
    if (sanitizedInput.website !== undefined)
      updateData.website = sanitizedInput.website || null;
    if (sanitizedInput.linkedin !== undefined)
      updateData.linkedin = sanitizedInput.linkedin || null;
    if (sanitizedInput.photoUrl !== undefined)
      updateData.photoUrl = sanitizedInput.photoUrl;
    if (sanitizedInput.objective !== undefined)
      updateData.objective = sanitizedInput.objective;
    if (sanitizedInput.skills !== undefined)
      updateData.skills = sanitizedInput.skills;
    if (sanitizedInput.languages !== undefined)
      updateData.languages = sanitizedInput.languages;
    if (sanitizedInput.experience !== undefined)
      updateData.experience = sanitizedInput.experience;
    if (sanitizedInput.education !== undefined)
      updateData.education = sanitizedInput.education;
    if (sanitizedInput.templateId !== undefined)
      updateData.templateId = sanitizedInput.templateId;
    if (sanitizedInput.isPublic !== undefined)
      updateData.isPublic = sanitizedInput.isPublic;

    const resume = await resumeRepository.update(id, sanitizeData(updateData));

    return {
      success: true,
      data: toResumeData(resume),
      message: 'Resume updated successfully',
    };
  },

  // Delete resume
  async delete(id: string, userId: string): Promise<ActionState<ResumeData>> {
    const existingResume = await resumeRepository.findById(id);

    if (!existingResume) {
      return {
        success: false,
        error: 'Resume not found',
      };
    }

    if (existingResume.userId !== userId) {
      return {
        success: false,
        error: 'Access denied',
      };
    }

    const resume = await resumeRepository.delete(id);

    return {
      success: true,
      data: toResumeData(resume),
      message: 'Resume deleted successfully',
    };
  },

  // Get resume count for user
  async getCountByUserId(userId: string): Promise<ActionState<number>> {
    const count = await resumeRepository.countByUserId(userId);

    return {
      success: true,
      data: count,
    };
  },
};
