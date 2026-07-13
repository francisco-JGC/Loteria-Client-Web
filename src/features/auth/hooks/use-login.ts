import { useMutation } from '@tanstack/react-query';

import { login } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toApiError } from '@/shared/api/error-mapper';

import type { LoginPayload } from '@/features/auth/types';
import type { ApiError } from '@/shared/types/api';

/**
 * Login mutation. On success it hydrates the auth store; the caller just
 * navigates. Errors are normalized to {@link ApiError}.
 */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<Awaited<ReturnType<typeof login>>, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: (session) => setSession(session),
    onError: (error) => {
      // Rethrow as ApiError so consumers see a uniform shape.
      throw toApiError(error);
    },
  });
}
