import type { Prisma, Contact } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface ContactFindManyParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactFindManyResult {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const contactRepository = {
  // Find contact by ID
  async findById(id: string): Promise<Contact | null> {
    return prisma.contact.findUnique({
      where: { id },
    });
  },

  // Find many contacts with pagination and filters
  async findMany(params: ContactFindManyParams): Promise<ContactFindManyResult> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ContactWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Create contact
  async create(data: Prisma.ContactCreateInput): Promise<Contact> {
    return prisma.contact.create({ data });
  },

  // Delete contact
  async delete(id: string): Promise<Contact> {
    return prisma.contact.delete({
      where: { id },
    });
  },

  // Count all contacts
  async count(): Promise<number> {
    return prisma.contact.count();
  },

  // Get statistics
  async getStatistics(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, today, thisWeek, thisMonth] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      prisma.contact.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.contact.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
    ]);

    return { total, today, thisWeek, thisMonth };
  },
};
