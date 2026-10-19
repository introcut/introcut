import { create } from "zustand";

/** Which screen is showing, which side sheet is open, whether the side rail is expanded. Not part of the project. */
export type View = "start" | "verdict" | "board" | "timeline";
export type SheetName = "scene" | "media" | "export" | "settings";

interface UiState {
  view: View;
  sheet: SheetName | null;
  railOpen: boolean;
  go: (view: View) => void;
  openSheet: (sheet: SheetName) => void;
  closeSheet: () => void;
  toggleRail: () => void;
}

export const useUi = create<UiState>()((set) => ({
  view: "start",
  sheet: null,
  railOpen: false,
  go: (view) => set({ view, sheet: null }),
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
  toggleRail: () => set((s) => ({ railOpen: !s.railOpen })),
}));
