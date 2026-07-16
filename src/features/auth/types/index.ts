export type UserRole = 'admin' | 'partner' | 'seller';

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
}

export interface LoginPayload {
  username: string;
  password: string;
}
