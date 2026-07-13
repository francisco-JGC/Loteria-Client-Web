import { useMutation } from '@tanstack/react-query';

import { login } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toApiError } from '@/shared/api/error-mapper';

import type { AuthSession, LoginPayload } from '@/features/auth/types';
import type { ApiError } from '@/shared/types/api';

/**
 * Login mutation. On success it hydrates the auth store.
 *
 * The admin panel is admin-only: if the backend returns a non-admin session
 * we reject the login with a friendly {@link ApiError}. Sellers use the
 * mobile app; letting them in would land them in an empty admin shell.
 */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<AuthSession, ApiError, LoginPayload>({
    mutationFn: async (payload) => {
      let session: AuthSession;
      try {
        session = await login(payload);
      } catch (error) {
        throw toApiError(error);
      }
      if (session.user.role !== 'admin') {
        throw {
          status: 403,
          code: 'Forbidden',
          message:
            'Este panel es solo para administradores. ' +
            'Usa la aplicación móvil para tu cuenta de vendedor.',
        } satisfies ApiError;
      }
      return session;
    },
    onSuccess: (session) => setSession(session),
  });
}
