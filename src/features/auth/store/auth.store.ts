import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { queryClient } from '@/app/providers/query-provider';

import type { AuthSession } from '@/features/auth/types';

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

/**
 * Auth state store. This is the ONLY place where the JWT and session user live.
 *
 * We use zustand with `persist` because the JWT must survive full page reloads
 * (unlike React Query state, which is in-memory). Do not put server data
 * (games, tickets, etc.) here — that belongs in React Query.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: 'loteria.auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Bare token accessor for non-React code (interceptors). */
export function getAuthToken(): string | null {
  return useAuthStore.getState().session?.token ?? null;
}

/**
 * Force a logout — used by 401 interceptor to clear the invalid session.
 * Also wipes the TanStack Query cache so the next user (or the next login)
 * doesn't see the previous session's data during the stale window.
 */
export function forceLogout(): void {
  useAuthStore.getState().clearSession();
  queryClient.clear();
}
