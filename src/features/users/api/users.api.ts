import { http } from '@/shared/api/http';

import type {
  CreateUserPayload,
  ListUsersParams,
  ListUsersResponse,
  User,
} from '@/features/users/types';

export async function listUsers(
  params: ListUsersParams,
): Promise<ListUsersResponse> {
  const { data } = await http.get<ListUsersResponse>('/users', {
    // axios strips undefined values automatically.
    params: {
      role: params.role,
      search: params.search || undefined,
      limit: params.limit,
      offset: params.offset,
    },
  });
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await http.post<User>('/users', payload);
  return data;
}
