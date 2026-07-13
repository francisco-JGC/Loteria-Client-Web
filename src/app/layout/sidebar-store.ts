import { create } from 'zustand';

interface SidebarState {
  mobileOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * UI state for the responsive sidebar drawer.
 *
 * - Desktop (md+): the sidebar is always visible; `mobileOpen` is ignored.
 * - Mobile (< md): the sidebar is hidden off-canvas by default; setting
 *   `mobileOpen` to true slides it in as an overlay.
 *
 * Not persisted — the drawer should always start closed on load so the user
 * lands on content, not on the menu.
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  mobileOpen: false,
  open: () => set({ mobileOpen: true }),
  close: () => set({ mobileOpen: false }),
  toggle: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
}));
