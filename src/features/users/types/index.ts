export type UserRole = 'admin' | 'seller';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  address: string | null;
  nationalId: string | null;
  paymentPercentage: number | null;
  salePointId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListUsersParams {
  role?: UserRole;
  search?: string;
  limit: number;
  offset: number;
}

export interface ListUsersResponse {
  items: User[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
  role: UserRole;
  address?: string;
  nationalId?: string;
  paymentPercentage?: number;
  salePointId?: string;
}
