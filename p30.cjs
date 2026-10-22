const fs=require("fs");
const must=(c,m)=>{if(!c)throw new Error(m)};
const edit=(f,pairs)=>{let s=fs.readFileSync(f,"utf8");for(const [a,b] of pairs){must(s.includes(a),f+": "+a.slice(0,50));s=s.replace(a,()=>b);}fs.writeFileSync(f,s);};

edit("src/model/schema.ts",[[`["hook-text", "big-number", "end-card"]`,`["hook-text", "big-number", "end-card", "text-card"]`]]);

edit("src/render/templates.ts",[
[`const EndCardProps =`,`const TextCardProps = z.object({ text: z.string().max(160).default("…"), tone: Tone });
const EndCardProps =`],
[`export const TEMPLATES: Record<TemplateId, TemplateDef> = { "hook-text": hookText, "big-number": bigNumber, "end-card": endCard };`,`const textCard: TemplateDef = {
  name: "Statement card",
  description: "One sentence, large and centred. The default card for any line of the story.",
  example: { text: "Ram's seedlings stood in cracked, dry mud.", tone: "paper" },
  schema: TextCardProps,
  draw(ctx, props: z.infer<typeof TextCardProps>, t) {
    const p = background(ctx, props.tone);
    const k = easeOutCubic(t / 450);
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(0, (1 - k) * 50);
    ctx.fillStyle = p.fg;
    drawCentered(ctx, fitText(ctx, props.text, boxW, boxH * 0.8, 112, 44), W / 2, boxCy);
    ctx.restore();
  },
};

export const TEMPLATES: Record<TemplateId, TemplateDef> = { "hook-text": hookText, "big-number": bigNumber, "end-card": endCard, "text-card": textCard };`],
]);

// rules brain: use the person's own words
edit("src/ai/brain/rules.ts",[
[`import { makeScene } from "../../model/types";`,`import { compileShots, shotsFromYourWords, type ShotInput } from "../compile";`],
]);
let r=fs.readFileSync("src/ai/brain/rules.ts","utf8");
const a=r.indexOf("  async plan(input: BrainInput, format: FormatPick): Promise<PlanDraft> {");
must(a>0,"plan");
r=r.slice(0,a)+`  async plan(input: BrainInput): Promise<PlanDraft> {
    // Basic mode can't write a script, so it uses the person's own words: the idea plus any answers they gave.
    const texts = [input.idea, ...input.qa.map((x) => x.a).filter((x) => x.trim())];
    let shots: ShotInput[] = shotsFromYourWords(texts);
    // Their photos (not clips) go under the middle lines, in order; the first and last lines stay cards.
    const photos = input.media.filter((m) => m.kind === "photo");
    let next = 0;
    shots = shots.map((s, i) => (i > 0 && i < shots.length - 1 && next < photos.length ? { ...s, media: { id: photos[next++].id, kind: "photo" as const } } : s));
    const { scenes, lines } = compileShots(shots);
    return {
      language: input.language,
      scenes,
      lines,
      note:
        shots.length < 3
          ? "Basic mode used your own words, and there were only a few, so the video is short. Write more of your story, or connect your own AI (account menu, bottom left) to have it written for you."
          : "Basic mode used your own words: each sentence became a card. Connect your own AI (account menu, bottom left) to have the script written for you.",
    };
  },
};
`;
r=r.replace(`import { CUSTOM_FORMAT_ID, FORMATS, getFormat } from "../formats";`,`import { CUSTOM_FORMAT_ID, FORMATS } from "../formats";`);
r=r.replace(`import type { Assessment, Brain, BrainInput, FormatPick, PlanDraft } from "./types";`,`import type { Assessment, Brain, BrainInput, PlanDraft } from "./types";`);
fs.writeFileSync("src/ai/brain/rules.ts",r);

// llm brain: compile cards
let l=fs.readFileSync("src/ai/brain/llm.ts","utf8");
const s1=l.indexOf("      const byName = new Map(");
const s2=l.indexOf("    },\n  };\n}");
must(s1>0&&s2>s1,"llm plan markers");
l=l.slice(0,s1)+`      const byName = new Map(input.media.filter((m) => m.kind !== "audio").map((m) => [m.name.toLowerCase(), m]));
      const shots: ShotInput[] = r.shots.slice(0, 12).map((s) => {
        const file = s.media ? byName.get(s.media.toLowerCase()) : undefined;
        return {
          beat: s.beat,
          role: s.role,
          line: s.line,
          intent: s.intent,
          seconds: s.seconds,
          media: file ? { id: file.id, kind: file.kind as "video" | "photo", durationMs: file.durationMs } : undefined,
        };
      });
      const { scenes, lines } = compileShots(shots);
      return {
        language: input.language,
        scenes,
        lines: lines.map((ln, i) => ({ ...ln, roman: r.shots[i].roman || undefined })),
      };
`+l.slice(s2);
l=l.replace(`import { makeScene } from "../../model/types";\n`,`import { compileShots, type ShotInput } from "../compile";\n`);
fs.writeFileSync("src/ai/brain/llm.ts",l);

// store summary + UI
edit("src/store/useStore.ts",[[`filled: p.scenes.filter((x) => x.source).length,`,`filled: p.scenes.filter((x) => x.source || x.card).length,`]]);
edit("src/ui/brainStore.ts",[[`useUi.getState().go("board");`,`useUi.getState().go("timeline");`]]);
edit("src/ui/BoardScreen.tsx",[
[`const empty = scenes.filter((s) => !s.source).length;`,`const empty = scenes.filter((s) => !s.source && !s.card).length;`],
[`${p.scene.source ? "" : "empty"}`,`${p.scene.source || p.scene.card ? "" : "empty"}`],
[`{!thumb && <span className="ph">{!p.scene.source ? "needs a clip" : item?.kind === "video" ? "video" : "no preview"}</span>}`,`{!thumb && <span className="ph">{p.scene.card ? "text card" : !p.scene.source ? "needs a clip" : item?.kind === "video" ? "video" : "no preview"}</span>}`],
[`{p.scene.intent && !p.scene.source && <div className="intent">{p.scene.intent}</div>}`,`{p.scene.intent && !p.scene.source && !p.scene.card && <div className="intent">{p.scene.intent}</div>}`],
]);
edit("src/ui/OverviewScreen.tsx",[
[`const filled = shots.filter((s) => s.source);`,`const filled = shots.filter((s) => s.source || s.card);`],
[`className={\`clip \${s.source ? "" : "empty"}\``,`className={\`clip \${s.source || s.card ? "" : "empty"}\``],
[`{!s.source && <span className="ph">needs a clip</span>}`,`{s.card ? <span className="ph">card</span> : !s.source && <span className="ph">needs a clip</span>}`],
]);
console.log("ok");
