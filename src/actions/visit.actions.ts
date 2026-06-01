'use server';

import { visitService } from '@/services';
import type { ActionState } from '@/types';
import type { SiteVisit } from '@prisma/client';

// Increment visit count (public - called from client)
export async function incrementVisitAction(
  page: string = '/'
): Promise<ActionState<SiteVisit>> {
  return visitService.incrementVisit(page);
}

// Get visit count for a page (public)
export async function getPageVisitsAction(
  page: string
): Promise<ActionState<number>> {
  return visitService.getPageVisits(page);
}

// Get total visits (public)
export async function getTotalVisitsAction(): Promise<ActionState<number>> {
  return visitService.getTotalVisits();
}
