export interface SellerReportRow {
  sellerId: string;
  sellerName: string;
  ticketCount: number;
  voidedCount: number;
  paidCount: number;
  billed: number;
  paidPrize: number;
  paymentPercentage: number | null;
  /** `billed × paymentPercentage / 100` rounded — null when % not set. */
  salary: number | null;
}

export interface SellerReportParams {
  salePointId?: string;
  sellerId?: string;
  /** ISO with Managua offset (`-06:00`). Inclusive. */
  from?: string;
  /** ISO with Managua offset. Inclusive. */
  to?: string;
}

export interface SellerReportResponse {
  items: SellerReportRow[];
}
