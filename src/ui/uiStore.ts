import { create } from "zustand";

/**
 * Which screen is showing, which side sheet is open, whether the side rail is expanded. Not part of the project.
 * landing + signin: before sign-in. home: the person's projects and the one question. overview: a project's folder
 * (what you sent, the check, script, clips, final video). verdict, board, timeline: working on the project.
 */
export type View = "landing" | "signin" | "home" | "overview" | "verdict" | "board" | "timeline";
export type SheetName = "scene" | "export" | "account";

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
  view: "landing",
  sheet: null,
  railOpen: false,
  go: (view) => set({ view, sheet: null }),
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
  toggleRail: () => set((s) => ({ railOpen: !s.railOpen })),
}));
