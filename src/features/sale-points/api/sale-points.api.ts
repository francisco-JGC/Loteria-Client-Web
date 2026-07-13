import { http } from '@/shared/api/http';

import type { SalePoint } from '@/features/sale-points/types';

export async function listSalePoints(): Promise<SalePoint[]> {
  const { data } = await http.get<SalePoint[]>('/sale-points');
  return data;
}
