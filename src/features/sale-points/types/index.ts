export interface SalePoint {
  id: string;
  name: string;
  code: string;
  ownerPartnerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalePointPayload {
  name: string;
  code: string;
  ownerPartnerId?: string;
}

export interface UpdateSalePointPayload {
  name?: string;
  code?: string;
  ownerPartnerId?: string | null;
}
