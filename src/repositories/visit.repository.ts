import type { SiteVisit } from '@prisma/client';
import prisma from '@/lib/prisma';

export const visitRepository = {
  // Get visit count for a page
  async findByPage(page: string): Promise<SiteVisit | null> {
    return prisma.siteVisit.findUnique({
      where: { page },
    });
  },

  // Increment visit count (upsert)
  async incrementCount(page: string): Promise<SiteVisit> {
    return prisma.siteVisit.upsert({
      where: { page },
      update: {
        count: { increment: 1 },
      },
      create: {
        page,
        count: 1,
      },
    });
  },

  // Get total visits across all pages
  async getTotalCount(): Promise<number> {
    const result = await prisma.siteVisit.aggregate({
      _sum: { count: true },
    });
    return result._sum.count ?? 0;
  },

  // Get all page visits
  async findAll(): Promise<SiteVisit[]> {
    return prisma.siteVisit.findMany({
      orderBy: { count: 'desc' },
    });
  },
};
