import { create } from 'zustand';

export const useUIStore = create(set => ({
  sidebarOpen: true,  // initial state
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
}));
