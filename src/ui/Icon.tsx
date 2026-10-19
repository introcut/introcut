const PATHS = {
  menu: "M4 7h16M4 12h16M4 17h16",
  home: "M4 11l8-7 8 7M6 10v9h12v-9",
  media: "M4 6h16v12H4zM4 10h16M9 6v4M15 6v4",
  settings: "M5 8h14M5 16h14M9 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  undo: "M9 7L4 12l5 5M4 12h10a5 5 0 0 1 0 10h-2",
  redo: "M15 7l5 5-5 5M20 12H10a5 5 0 0 0 0 10h2",
  plus: "M12 5v14M5 12h14",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
