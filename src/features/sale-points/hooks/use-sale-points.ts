import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createSalePoint,
  listSalePoints,
  toggleSalePoint,
} from '@/features/sale-points/api/sale-points.api';
import { toApiError } from '@/shared/api/error-mapper';

import type {
  CreateSalePointPayload,
  SalePoint,
} from '@/features/sale-points/types';
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

export function useCreateSalePoint() {
  const qc = useQueryClient();
  return useMutation<SalePoint, ApiError, CreateSalePointPayload>({
    mutationFn: async (payload) => {
      try {
        return await createSalePoint(payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (sp) => {
      toast.success(`Sucursal "${sp.name}" creada`);
      qc.invalidateQueries({ queryKey: salePointsQueryKeys.all });
    },
    onError: (error) => {
      toast.error('No se pudo crear la sucursal', {
        description: error.message,
      });
    },
  });
}

export function useToggleSalePoint() {
  const qc = useQueryClient();
  return useMutation<
    SalePoint,
    ApiError,
    { id: string; active: boolean }
  >({
    mutationFn: async ({ id, active }) => {
      try {
        return await toggleSalePoint(id, active);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: (sp) => {
      toast.success(
        sp.isActive
          ? `Sucursal "${sp.name}" activada`
          : `Sucursal "${sp.name}" desactivada`,
      );
      qc.invalidateQueries({ queryKey: salePointsQueryKeys.all });
    },
    onError: (error) => {
      toast.error('No se pudo actualizar la sucursal', {
        description: error.message,
      });
    },
  });
}
