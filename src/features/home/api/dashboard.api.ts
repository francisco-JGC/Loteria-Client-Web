import { http } from '@/shared/api/http';

import type { DashboardSummary } from '@/features/home/types';

/** GET /dashboard/summary — one call that powers the whole home screen. */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await http.get<DashboardSummary>('/dashboard/summary');
  return data;
}
