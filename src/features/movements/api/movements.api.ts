import { http } from '@/shared/api/http';

import type {
  CreateMovementPayload,
  ListMovementsParams,
  ListMovementsResponse,
  Movement,
  MovementsBalanceParams,
  MovementsBalanceResponse,
} from '@/features/movements/types';

export async function listMovements(
  params: ListMovementsParams,
): Promise<ListMovementsResponse> {
  const { data } = await http.get<ListMovementsResponse>('/movements', {
    params: {
      salePointId: params.salePointId || undefined,
      type: params.type || undefined,
      from: params.from || undefined,
      to: params.to || undefined,
      page: params.page,
      limit: params.limit,
    },
  });
  return data;
}

export async function createMovement(
  payload: CreateMovementPayload,
): Promise<Movement> {
  const { data } = await http.post<Movement>('/movements', payload);
  return data;
}

export async function deleteMovement(id: string): Promise<void> {
  await http.delete(`/movements/${id}`);
}

export async function getMovementsBalance(
  params: MovementsBalanceParams,
): Promise<MovementsBalanceResponse> {
  const { data } = await http.get<MovementsBalanceResponse>(
    '/movements/balance',
    {
      params: {
        salePointId: params.salePointId || undefined,
        from: params.from || undefined,
        to: params.to || undefined,
      },
    },
  );
  return data;
}
