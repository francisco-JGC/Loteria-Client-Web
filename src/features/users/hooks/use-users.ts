import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createUser,
  listUsers,
  updateUser,
} from '@/features/users/api/users.api';
import { toApiError } from '@/shared/api/error-mapper';

import type {
  CreateUserPayload,
  ListUsersParams,
  ListUsersResponse,
  UpdateUserPayload,
  User,
} from '@/features/users/types';
import type { ApiError } from '@/shared/types/api';

export const usersQueryKeys = {
  all: ['users'] as const,
  list: (params: ListUsersParams) =>
    [...usersQueryKeys.all, 'list', params] as const,
};

export function useUsers(params: ListUsersParams) {
  return useQuery<ListUsersResponse, ApiError>({
    queryKey: usersQueryKeys.list(params),
    queryFn: async () => {
      try {
        return await listUsers(params);
      } catch (error) {
        throw toApiError(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation<User, ApiError, CreateUserPayload>({
    mutationFn: async (payload) => {
      try {
        return await createUser(payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersQueryKeys.all });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation<
    User,
    ApiError,
    { id: string; payload: UpdateUserPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      try {
        return await updateUser(id, payload);
      } catch (error) {
        throw toApiError(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersQueryKeys.all });
    },
  });
}
