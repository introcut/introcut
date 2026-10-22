// The project file. Full v2 schema from docs/PLAN.md §5.
// Most sections are filled by later milestones; every field has a default so a fresh project is valid JSON from day one.
import { z } from "zod";

export const MediaKindSchema = z.enum(["video", "photo", "audio"]);
export const MediaOriginSchema = z.enum(["camera", "screen", "selfie", "ai-generated", "unknown"]);
const RangeSchema = z.object({ startMs: z.number(), endMs: z.number() });

/** Facts measured in the browser the moment a file is added (see media/probe.ts). */
export const MediaProbeSchema = z.object({
  durationMs: z.number().optional(),
  width: z.number(),
  height: z.number(),
  hasAudio: z.boolean().optional(),
  /** Average loudness in dBFS (0 = digital maximum, quieter is more negative). Not true LUFS. */
  avgLoudnessDb: z.number().nullable().optional(),
  /** Loudest single moment in dBFS. */
  peakDb: z.number().nullable().optional(),
  sizeBytes: z.number(),
  mime: z.string(),
});

export const MediaItemSchema = z.object({
  id: z.string(),
  kind: MediaKindSchema,
  name: z.string(),
  origin: MediaOriginSchema.default("unknown"),
  generatorId: z.string().optional(),
  watermark: z.enum(["none", "visible", "unknown"]).default("unknown"),
  probe: MediaProbeSchema,
  analysis: z
    .object({
      speech: z.array(RangeSchema).default([]),
      words: z.array(z.object({ text: z.string(), startMs: z.number(), endMs: z.number(), conf: z.number().optional() })).default([]),
      motionPeaks: z.array(z.number()).default([]),
      quality: z.array(RangeSchema.extend({ score: z.number(), flags: z.array(z.string()).default([]) })).default([]),
    })
    .optional(),
});

/** What a user edit can lock so the AI leaves it alone. */
export const LOCK_KEYS = ["trim", "order", "captions", "overlays", "transition", "framing", "prompt", "script"] as const;
export const LockKeySchema = z.enum(LOCK_KEYS);
const LocksSchema = z.object(Object.fromEntries(LOCK_KEYS.map((k) => [k, z.literal(true).optional()])) as Record<(typeof LOCK_KEYS)[number], z.ZodOptional<z.ZodLiteral<true>>>);

const CaptionWordSchema = z.object({ text: z.string(), startMs: z.number(), endMs: z.number() });

/** Built-in animated scene templates, drawn by Introcut itself (no clip needed). Props are checked by each template (src/render/templates.ts). */
export const TEMPLATE_IDS = ["hook-text", "big-number", "end-card"] as const;
export const TemplateIdSchema = z.enum(TEMPLATE_IDS);

export const SceneSchema = z.object({
  id: z.string(),
  beat: z.string().default(""),
  role: z.enum(["hook", "body", "cta"]).default("body"),
  type: z.enum(["generated", "user-media", "card", "filler", "avatar"]).default("user-media"),
  /** What this beat must show. */
  intent: z.string().default(""),
  /** If set, the scene is drawn by a built-in template instead of a clip or photo. */
  card: z.object({ template: TemplateIdSchema, props: z.record(z.string(), z.unknown()).default({}) }).optional(),
  slot: z
    .object({
      targetMs: z.number().default(0),
      status: z.enum(["empty", "filled", "flagged"]).default("filled"),
      flags: z.array(z.string()).default([]),
    })
    .default({}),
  source: z.object({ mediaId: z.string(), inMs: z.number(), outMs: z.number() }).optional(),
  generation: z
    .object({
      generatorId: z.string(),
      prompt: z.string(),
      startFrameMediaId: z.string().optional(),
      refMediaIds: z.array(z.string()).default([]),
      why: z.string().default(""),
      attempts: z.array(z.object({ promptVersion: z.number(), mediaId: z.string().optional(), note: z.string().optional() })).default([]),
    })
    .optional(),
  filler: z
    .object({
      kind: z.enum(["freeze-callout", "kenburns", "parallax", "stretch", "card", "talking-still"]),
      params: z.record(z.string(), z.unknown()).default({}),
    })
    .optional(),
  framing: z
    .object({ mode: z.enum(["center", "manual", "auto-zoom"]).default("center"), x: z.number().default(0.5), y: z.number().default(0.5), zoom: z.number().default(1) })
    .default({}),
  captions: z.object({ enabled: z.boolean().default(false), words: z.array(CaptionWordSchema).default([]) }).default({}),
  overlays: z
    .array(z.object({ id: z.string(), text: z.string(), startMs: z.number(), endMs: z.number(), position: z.enum(["top", "center", "bottom"]).default("bottom") }))
    .default([]),
  transition: z
    .object({ kind: z.enum(["cut", "fade", "slide", "j-cut", "l-cut"]).default("cut"), durationMs: z.number().default(0) })
    .default({}),
  audio: z.object({ useSourceAudio: z.boolean().default(true), volume: z.number().default(1) }).default({}),
  grade: z.object({ matchToLook: z.boolean().default(false) }).default({}),
  locks: LocksSchema.default({}),
  provenance: z.object({ by: z.enum(["ai", "user"]).default("user"), reason: z.string().optional() }).default({}),
});

export const ProjectSchema = z.object({
  version: z.literal(2),
  id: z.string(),
  name: z.string().default("Untitled"),
  createdAt: z.string(),
  updatedAt: z.string(),
  mode: z.enum(["generated", "presenter", "mixed"]).default("generated"),
  settings: z
    .object({
      width: z.literal(1080).default(1080),
      height: z.literal(1920).default(1920),
      fps: z.literal(30).default(30),
      targetDurationSec: z.number().default(30),
      maxDurationSec: z.number().default(60),
      language: z.enum(["en", "hi", "ne"]).default("en"),
      captionPreset: z.literal("bold-highlight").default("bold-highlight"),
      /** "local" (in-browser model) is not built yet and runs as "rules". */
      llm: z.enum(["local", "user-key", "rules"]).default("rules"),
    })
    .default({}),
  brief: z
    .object({
      idea: z.string().default(""),
      audience: z.string().optional(),
      feeling: z.string().optional(),
      cta: z.string().optional(),
      links: z.array(z.string()).default([]),
      assetIds: z.array(z.string()).default([]),
      qa: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    })
    .default({}),
  readiness: z
    .object({
      /** Absent in basic (no-AI) mode: rules can't honestly judge an idea, so no scores are made up. */
      scores: z.object({ hook: z.number(), clarity: z.number(), feasibility: z.number(), novelty: z.number() }).optional(),
      overall: z.number().optional(),
      reasons: z.record(z.string(), z.string()).default({}),
      missing: z.array(z.object({ ask: z.string(), fixHint: z.string() })).default([]),
      proceededAnyway: z.boolean().default(false),
    })
    .optional(),
  format: z
    .object({
      id: z.string(),
      why: z.string().default(""),
      beats: z.array(z.object({ id: z.string(), kind: z.string(), targetMs: z.number() })).default([]),
    })
    .optional(),
  styleBible: z
    .object({
      character: z.object({ name: z.string(), description: z.string(), anchorMediaIds: z.array(z.string()).default([]) }).optional(),
      look: z.object({ lighting: z.string().default(""), palette: z.array(z.string()).default([]), lens: z.string().default(""), camera: z.string().default("") }).default({}),
      aspect: z.literal("9:16").default("9:16"),
      negative: z.array(z.string()).default([]),
      seriesLine: z.string().default(""),
    })
    .optional(),
  script: z
    .object({
      language: z.string().default("en"),
      lines: z
        .array(
          z.object({
            id: z.string(),
            sceneId: z.string(),
            text: z.string(),
            roman: z.string().optional(),
            /** The spoken line as an audio file in the media list (made by text-to-speech or recorded). */
            audioMediaId: z.string().optional(),
            voice: z.enum(["generator", "tts", "recorded", "cloned", "none"]).default("none"),
          }),
        )
        .default([]),
    })
    .default({}),
  media: z.array(MediaItemSchema).default([]),
  scenes: z.array(SceneSchema).default([]),
  audio: z
    .object({
      sfx: z.array(z.object({ id: z.string(), sceneId: z.string(), atMs: z.number(), soundId: z.string(), volume: z.number().default(1) })).default([]),
      music: z
        .object({ trackId: z.string().nullable().default(null), master: z.number().default(0.8), ducked: z.number().default(0.15), open: z.number().default(0.4) })
        .default({}),
      normalize: z.object({ loudnessLUFS: z.number().default(-14), matchVoiceAcrossClips: z.boolean().default(true) }).default({}),
    })
    .default({}),
  avatar: z
    .object({
      consent: z.object({ mediaId: z.string(), phrase: z.string(), at: z.string() }),
      baseVideoMediaId: z.string(),
      engine: z.enum(["hf-space-musetalk", "external-clip"]),
      layout: z.enum(["bubble", "split", "intro"]),
    })
    .optional(),
  export: z
    .object({ title: z.string().default(""), description: z.string().default(""), hashtags: z.array(z.string()).default([]), aiLabelAck: z.boolean().default(false) })
    .default({}),
  diagnosis: z.unknown().optional(), // shape defined in Milestone 5
  meta: z.object({ notes: z.string().optional() }).passthrough().default({}),
});

export type MediaKind = z.infer<typeof MediaKindSchema>;
export type MediaOrigin = z.infer<typeof MediaOriginSchema>;
export type MediaProbe = z.infer<typeof MediaProbeSchema>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
export type LockKey = z.infer<typeof LockKeySchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type TemplateId = z.infer<typeof TemplateIdSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export function emptyProject(): Project {
  const now = new Date().toISOString();
  return ProjectSchema.parse({ version: 2, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
}

/** Build a complete scene (all defaults filled in) from partial fields. */
export function makeScene(fields: Partial<Scene> & { id?: string }): Scene {
  return SceneSchema.parse({ id: crypto.randomUUID(), ...fields });
}
