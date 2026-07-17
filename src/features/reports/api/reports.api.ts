import { http } from '@/shared/api/http';

import type {
  SellerReportParams,
  SellerReportResponse,
} from '@/features/reports/types';

export async function getSellerReport(
  params: SellerReportParams,
): Promise<SellerReportResponse> {
  const { data } = await http.get<SellerReportResponse>(
    '/tickets/seller-report',
    {
      params: {
        salePointId: params.salePointId || undefined,
        sellerId: params.sellerId || undefined,
        from: params.from || undefined,
        to: params.to || undefined,
      },
    },
  );
  return data;
}
