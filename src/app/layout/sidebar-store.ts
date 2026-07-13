import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

/**
 * UI state for the admin sidebar (expanded vs collapsed). Persisted so the
 * user's preference survives page reloads.
 */
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (value) => set({ collapsed: value }),
    }),
    {
      name: 'loteria.sidebar',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
