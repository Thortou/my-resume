import type { SiteVisit } from '@prisma/client';
import { visitRepository } from '@/repositories';
import type { ActionState } from '@/types';

export const visitService = {
  // Get visit count for a specific page
  async getPageVisits(page: string): Promise<ActionState<number>> {
    const visit = await visitRepository.findByPage(page);

    return {
      success: true,
      data: visit?.count ?? 0,
    };
  },

  // Increment visit count for a page
  async incrementVisit(page: string = '/'): Promise<ActionState<SiteVisit>> {
    const visit = await visitRepository.incrementCount(page);

    return {
      success: true,
      data: visit,
    };
  },

  // Get total visits across all pages
  async getTotalVisits(): Promise<ActionState<number>> {
    const total = await visitRepository.getTotalCount();

    return {
      success: true,
      data: total,
    };
  },

  // Get all page visit statistics
  async getAllPageVisits(): Promise<ActionState<SiteVisit[]>> {
    const visits = await visitRepository.findAll();

    return {
      success: true,
      data: visits,
    };
  },
};
