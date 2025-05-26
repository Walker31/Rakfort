import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isDrawerCollapsed: true,
  isSidebarOpen: false,
  isNavbarVisible: true,

  toggleNavbar: () =>
    set((state) => ({ isNavbarVisible: !state.isNavbarVisible })),
  toggleDrawer: () =>
    set((state) => ({ isDrawerCollapsed: !state.isDrawerCollapsed })),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setNavbarCollapsed: (val) => set({ isNavbarVisible: val }),
  setDrawerCollapsed: (val) => set({ isDrawerCollapsed: val }),
  setSidebarOpen: (val) => set({ isSidebarOpen: val }),
}));
