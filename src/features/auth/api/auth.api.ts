import { http } from '@/shared/api/http';

import type {
  AuthSession,
  AuthenticatedUser,
  LoginPayload,
} from '@/features/auth/types';

interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

/** POST /auth/login — thin wrapper around the backend endpoint. */
export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await http.post<LoginResponse>('/auth/login', payload);
  return { token: data.accessToken, user: data.user };
}
