import { http } from '@/shared/api/http';

import type {
  MovementsBalanceParams,
  MovementsBalanceResponse,
} from '@/features/movements/types';

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
