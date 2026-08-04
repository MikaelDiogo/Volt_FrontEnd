import { create } from "zustand";

export type ThemeMode = "dark" | "light";

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  themeMode: "dark",
  setThemeMode: (mode) => set({ themeMode: mode }),
}));
