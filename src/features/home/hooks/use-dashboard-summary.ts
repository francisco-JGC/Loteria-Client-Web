import { useQuery } from '@tanstack/react-query';

import { getDashboardSummary } from '@/features/home/api/dashboard.api';
import { toApiError } from '@/shared/api/error-mapper';

import type { DashboardSummary } from '@/features/home/types';
import type { ApiError } from '@/shared/types/api';

/** Query key namespace for the home dashboard. */
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardQueryKeys.all, 'summary'] as const,
};

/** Loads the aggregated home dashboard payload. */
export function useDashboardSummary() {
  return useQuery<DashboardSummary, ApiError>({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: async () => {
      try {
        return await getDashboardSummary();
      } catch (error) {
        throw toApiError(error);
      }
    },
  });
}
