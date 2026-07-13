import { useAuthStore } from '@/features/auth/store/auth.store';

/** Convenience read of the current session (or null). */
export function useSession() {
  return useAuthStore((s) => s.session);
}

/** True if there's an active session. */
export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => s.session !== null);
}

/** Logout action bound to the store. */
export function useLogout() {
  return useAuthStore((s) => s.clearSession);
}
