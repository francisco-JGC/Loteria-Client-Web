import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createUser, listUsers } from '@/features/users/api/users.api';
import { toApiError } from '@/shared/api/error-mapper';

import type {
  CreateUserPayload,
  ListUsersParams,
  ListUsersResponse,
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
    // Keep previous data visible while paginating so the table doesn't blink.
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
      // Refetch every users list currently cached — any filter/page can
      // include the new user.
      qc.invalidateQueries({ queryKey: usersQueryKeys.all });
    },
  });
}
