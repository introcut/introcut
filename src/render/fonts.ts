// Fonts that ship with Introcut so the preview and the exported video look the same on every computer.
// Inter (Latin) and Noto Sans Devanagari (Hindi, Nepali): both SIL Open Font License 1.1, see CREDITS.md.
import inter700 from "@fontsource/inter/files/inter-latin-700-normal.woff2?url";
import inter800 from "@fontsource/inter/files/inter-latin-800-normal.woff2?url";
import deva700 from "@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-700-normal.woff2?url";
import deva800 from "@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-800-normal.woff2?url";

/** CSS font list used for all video text: Latin first, Devanagari for the letters Inter doesn't have. */
export const VIDEO_FONT = 'Inter, "Noto Sans Devanagari", system-ui, sans-serif';

const FACES: [string, string, string][] = [
  ["Inter", inter700, "700"],
  ["Inter", inter800, "800"],
  ["Noto Sans Devanagari", deva700, "700"],
  ["Noto Sans Devanagari", deva800, "800"],
];

let loading: Promise<void> | null = null;

/** Load the video fonts once. Safe to call often; resolves when they are ready to draw with. */
export function ensureFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  return (loading ??= (async () => {
    await Promise.all(
      FACES.map(async ([family, url, weight]) => {
        const face = new FontFace(family, `url(${url}) format("woff2")`, { weight });
        await face.load();
        document.fonts.add(face);
      }),
    );
  })().catch((e) => {
    loading = null; // allow a retry; drawing falls back to the system font meanwhile
    console.warn("Video fonts failed to load", e);
  }));
}
