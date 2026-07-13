import { useQuery } from '@tanstack/react-query';

import { listSalePoints } from '@/features/sale-points/api/sale-points.api';
import { toApiError } from '@/shared/api/error-mapper';

import type { SalePoint } from '@/features/sale-points/types';
import type { ApiError } from '@/shared/types/api';

export const salePointsQueryKeys = {
  all: ['sale-points'] as const,
  list: () => [...salePointsQueryKeys.all, 'list'] as const,
};

export function useSalePoints() {
  return useQuery<SalePoint[], ApiError>({
    queryKey: salePointsQueryKeys.list(),
    queryFn: async () => {
      try {
        return await listSalePoints();
      } catch (error) {
        throw toApiError(error);
      }
    },
    // Sucursales cambian rara vez; con 5 minutos alcanza para no pegarle al
    // backend cada vez que abras el modal.
    staleTime: 5 * 60 * 1000,
  });
}
