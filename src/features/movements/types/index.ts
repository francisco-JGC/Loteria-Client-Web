export const MovementType = {
  EXPENSE: 'expense',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  OPENING: 'opening',
  CLOSING: 'closing',
  ADJUSTMENT: 'adjustment',
} as const;

export type MovementType = (typeof MovementType)[keyof typeof MovementType];

export interface Movement {
  id: string;
  salePointId: string;
  type: MovementType;
  amount: number;
  description: string;
  occurredAt: string;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MovementsBalanceRow {
  salePointId: string;
  salePointName: string;
  ownerPartnerId: string | null;
  ownerPartnerName: string | null;
  billed: number;
  paidPrize: number;
  deposits: number;
  withdrawals: number;
  expenses: number;
  net: number;
}

export interface MovementsBalanceParams {
  salePointId?: string;
  from?: string;
  to?: string;
}

export interface MovementsBalanceResponse {
  items: MovementsBalanceRow[];
}
