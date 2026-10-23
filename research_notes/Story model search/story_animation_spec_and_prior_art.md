# Story to animation by code: prior art, action vocabulary, rig, timeline engine and a 2-3 week build plan (as of 2026-10-22)

Method note: about 14 web searches (snippet-level, via a summarising search tool; no full paper reads). Prior notes in `research_notes/Code generated 30 second clips plan/` were skimmed, not repeated. Labels: **[cited]** = from a search result linked here; **[prior]** = already in earlier notes; **[inference]** = my design judgement; **[verify]** = unconfirmed. Much of sections 2-6 is design (inference) because the evidence for "what audiences accept" is thin, and I say so.

---

## 1. Prior art for story/text to 2D animation by code

### Takeaway
Nothing found does exactly "LLM writes a closed-vocabulary action timeline that a deterministic 2D engine animates". Academic work mostly generates pixels (Anim-Director, Story2Board) or code for diagrams (Code2Video/Manim). Product tools (Vyond, Animaker, Plotagon) are action-library editors where a human picks actions from a menu, which is the closest model for our vocabulary. One small open project (PyPI package `an`) uses almost the architecture we want: Markdown script, validated scene JSON, tween actions on named targets, 2D-cutout runtime.

### Cited Findings
- **Anim-Director** (arXiv 2408.09787, SIGGRAPH Asia 2024): GPT-4 as controller turns a narrative into a director's script, makes scene images with image tools, then videos from images. Output is generated pixels, not rig actions. — [arXiv](https://arxiv.org/html/2408.09787v1)
- **Story2Board** (arXiv 2508.09983, Aug 2025): training-free storyboard generator, LLM prompt decomposition plus consistency mechanisms in diffusion; produces still panels, not animation. — [alphaxiv](https://alphaxiv.org/overview/2508.09983v1)
- **Generating Animations from Screenplays** (arXiv 1904.05440, pre-LLM): NLP pipeline from screenplay text to rough storyboard/video. Useful as the oldest precedent for verb extraction to animation. — [arXiv](https://arxiv.org/pdf/1904.05440)
- **Code2Video** (arXiv 2510.01174, Show Lab NUS; NeurIPS 2025 DL4C workshop; one aggregator says ICML 2026, **verify**): Planner, Coder, Critic agents write Manim code; MMMC benchmark of 13 subjects; reported 40% gain over direct code generation. Lesson: a planner stage plus a critic for spatial layout; but it is LLM-written code on diagrams, not characters. — [arXiv](https://arxiv.org/pdf/2510.01174), [repo](https://github.com/showlab/Code2Video)
- **VideoDirectorGPT, LayoutGPT, Holodeck, SceneCraft** (two-level plans, relational placement, scene-graph first): already analysed. **[prior]** `llm_scene_spec_design.md` section 1. Key lesson to reuse: LLM chooses relations ("near", "left of"), code computes coordinates.
- **Text2Animation, Story-to-Motion, MovieAgent**: searched; **no reliable result found** for "Text2Animation"; I did not retrieve MovieAgent. Treat as gaps.
- **PyPI package `an`** ("AI-driven structured animation", versions 0.1.60-0.1.77): three layers (Markdown script, validated scene JSON as single source of truth, generated render code per backend); actions are tweens on named targets (e.g. a character's torso rotation) flattened to a canonical timeline; also a YAML `actions` block; custom 2D-cutout runtime plus Manim and Remotion backends; renders MP4 with two characters, lip-sync, emotion-driven expressions, camera push-in. Page content is repetitive and I could not fetch the page body (load error), so schema details and license are **verify**. Closest analogue to our plan; worth reading its schema before finalising ours. — [PyPI search hit](https://pypi.org/project/an/0.1.77/)
- **Hera** (YC S25 per one profile): prompt to editable code-based motion graphics, 5-60 s, MP4/GIF export; focus is typography/charts/brand motion, not character acting. A June 2026 analysis notes edit friction and quality concerns. Sources conflict on location and launch timing. — [neuronfeed](https://neuronfeed.com/startups/hera), [Airframe](https://www.airframe.ai/product/hera-video/analysis), [Medium](https://medium.com/data-science-collective/hera-build-motion-graphics-with-ai-ffee1fac66c7)
- **Plotagon**: user writes action and dialogue lines into a screenplay, picks scene and up to two characters; split preview updates as you type; mood states per dialogue line. 2013-era coverage called the animation wooden and Sims-like with limited choices. 2025 "AI-powered" claims are from a partner's promotional pages (unverified). — [Education World](https://www.educationworld.com/a_tech/tech-in-the-classroom/plotogon.shtml), [Concrete Playground](https://concreteplayground.com/perth/design-style/technology/plotagon-turns-your-words-into-an-animated-movie/amp), [Softpedia](https://mac.softpedia.com/blog/Laugh-Your-Rear-Off-with-Plotagon-for-Mac-OS-X-380107.shtml)
- **Vyond**: no official count; marketing says "dozens of facial expressions and hundreds of character actions"; actions chosen from an Action panel by search ("walk", "run"); walking along a path is a separate Motion Path feature; expressions are a separate icon paired with body actions; 65 accessibility actions added (mobility aids). — [Vyond help: actions](https://help.vyond.com/hc/en-us/sections/17215770924308-Actions), [walk/run](https://help.vyond.com/hc/en-us/articles/17221904681108-How-do-I-make-a-character-walk-or-run)
- **Animaker**: roughly 300 character animations in an undated blog post (**verify**); "Action+" chains multiple actions in sequence with timing adjusted on the timeline; enter and exit effects are separate settings. — [Animaker support](https://support.animaker.com/en/articles/3665468-how-do-i-use-action-in-animaker), [blog](https://www.animaker.com/blog/?p=8964)
- **Scratch**: motion primitives are glide to x,y over t seconds, go to, point in direction (0 up, 90 right), point towards, change/set x/y. Shows how few primitives teach-level storytelling needs. — [Wikibooks block reference](https://en.wikibooks.org/wiki/Scratch/Block_Reference_Guide)
- **Rive**: MIT runtimes; state machines advance over time and are driven by inputs. Editor is proprietary, free exports carry a splash. **[prior]** `characters_animation_lipsync.md` section 1; MIT claim also at [Rive docs](https://rive.app/docs/runtimes).
- **Text-to-motion (T2M-GPT, MotionGPT)**: output HumanML3D-263 motion features (20 fps, per community artifacts), a 3D humanoid representation; MotionGPT code reported MIT but depends on SMPL/SMPL-X with their own licences; T2M-GPT licence not found. Not usable for our 2D cartoon rigs without retargeting. — [MotionGPT card](https://huggingface.co/ZeyuLing/Motius-MotionGPT-HumanML3D), [T2M-GPT paper](https://arxiv.org/pdf/2301.06052), [sourcepulse](https://www.sourcepulse.org/projects/1594954)

### Inferences
- What to copy: (1) Vyond/Animaker/Plotagon split of body action vs facial expression vs path movement; (2) Animaker Action+ = per-actor ordered action chain with timeline timing; (3) Scratch primitives (glide, set, point) as the low-level layer under named verbs; (4) the `an` layering: script, validated JSON, renderer; (5) planner then critic from Code2Video, but the critic should be a deterministic validator plus an optional LLM repair pass, not a vision loop.
- Text-to-motion models are a dead end for V1 (3D, heavy, licence caveats).
- No prior art gives an evaluated closed vocabulary for LLM-written 2D story timelines, so our own eval (section 8) is necessary.

### Gaps
- No full-paper reads; MovieAgent, Text2Animation, LLM-driven Scratch/Blockly/Unity agent papers not retrieved. Vyond/Animaker exact counts and category names not found. `an` schema and licence not verified.

---

## 2. Action vocabularies and a proposed first closed vocabulary

### Takeaway
Commercial libraries are in the hundreds because they are art-driven; a 30 s story needs about 30-40 verbs if each verb is parameterised (target, direction, prop, speed, emotion). Split into five groups with separate tracks: movement, body action, face, prop state, camera/environment.

### Cited Findings
- See section 1 for Vyond ("hundreds"), Animaker (~300), Scratch (about 7 motion primitives). Mixamo animation names, TalkingHead gesture names and game animation-graph conventions: **not retrieved** (gap). Mixamo licence is Adobe's (not CC0/MIT; do not reuse). **[verify]**

### Proposed vocabulary v0 (37 verbs, inference)
Each verb: `actor` (or `prop`/`camera`), `t` or `after`, `dur` (optional, defaulted and clamped), args.

Movement (actor position; body pose is auto: walk cycle on)
1. `enter` {from: left|right|top|bottom, to: slot}
2. `exit` {to: left|right|...}
3. `walk_to` {to: slot|propId|actorId|x}
4. `run_to` {same}
5. `jump` {height, to?}
6. `turn` {face: left|right|toward:id}
7. `hop_on` / `climb` (V2, skip in v0)

Manipulation (needs a prop)
8. `pick_up` {prop}
9. `put_down` {prop, at}
10. `carry` {prop} (holds while moving; modifier on walk_to)
11. `throw` {prop, to}
12. `dig` {at} (spawns hole prop state)
13. `plant` {prop, at}
14. `cover` {prop/at, with: prop} (straw, soil)
15. `water` {at}
16. `give` {prop, to: actor}
17. `push` / `pull` {prop}
18. `eat` {prop}

Gestures
19. `wave` 20. `point` {at} 21. `nod` 22. `shake_head` 23. `shrug` 24. `clap` 25. `look_at` {target} 26. `idle` (default layer)

Expression/emotion (face + body modifier, held until changed)
27. `feel` {happy|sad|surprised|angry|scared|proud|tired} (one verb, enum arg)
28. `speak` {line id} (mouth flap driven by narration timing)

Reactions (short bursts, easy to fire on a group)
29. `react` {amazed|cheer|gasp|laugh|flinch}, `actors: [...]`, usable for crowds ("the village is amazed")

Prop state changes (prop track)
30. `appear` / `disappear` {fx: pop|fade}
31. `grow` {from, to scale, stages}
32. `set_state` {state: enum defined per prop, e.g. sprout stage 0..3, open, broken, full}
33. `glow` {on/off|pulse}
34. `move_prop` {to, arc}

Camera and environment
35. `camera` {mode: cut|pan_to|push_in|pull_out|shake|follow, target, amount}
36. `weather` {rain|snow|none}, `time_of_day` {day|dusk|night} (blended over dur)
37. `title`/`caption` is handled by existing caption track, not an action.

Counts: 6 + 11 + 8 + 2 + 1 + 5 + 3 + the camera verb = about 37 verbs, plus enums. Fewer if `give/push/pull/eat/hop_on` are deferred (core v0 = 28).

### Monkey-garlic story mapped (inference; 30 s, times in seconds, 4 scenes; narration length scales durations)
| t | Track | Action |
|---|---|---|
| 0.0 | env | scene `village_edge`, time_of_day day |
| 0.0 | camera | cut, wide on monkey slot left |
| 0.2 | monkey | enter from left to slot left-mid, feel happy |
| 1.0 | monkey | walk_to field_center (2.0 s) |
| 1.0 | camera | follow monkey |
| 3.0 | monkey | look_at ground; feel curious (use `look_at`) |
| 3.5 | scene | cut to `field` backdrop; monkey at slot center |
| 4.0 | monkey | dig at=center (3.0 s, anticipation then 3 digs); prop `hole` set_state open at 5.5 |
| 7.0 | monkey | pick_up garlic (from basket prop) 1.0 s |
| 8.0 | monkey | plant garlic at hole 1.5 s (garlic moves to hole, scales down) |
| 9.5 | monkey | pick_up straw 0.8 s |
| 10.3 | monkey | cover hole with straw 2.0 s; hole set_state closed; straw appears on mound |
| 12.5 | monkey | wipe brow (`shrug` as stand-in) / feel proud |
| 13.0 | camera | pull_out; time_of_day dusk over 3 s (time passes) |
| 16.0 | prop sprout | appear at mound, grow stage 1 (2 s) |
| 16.5 | camera | push_in on sprout, glow pulse 1 s |
| 18.5 | prop sprout | grow stage 3 (garlic plant) 2 s |
| 20.5 | monkey | react amazed (look_at sprout, jump small) |
| 22.0 | scene | cut to `village` backdrop, villagers x3 enter |
| 23.5 | villagers | react amazed (group), look_at sprout/camera |
| 25.5 | monkey | wave, villagers cheer/clap (2.5 s) |
| 28.0 | camera | pull_out, end hold to 30 s |
Narration: each sentence is a `beat` anchoring the actions that depict it (see section 4).

### Inferences
- Parameterised verbs plus enums keep the validator simple (an enum is checkable) and limit art to a small set of poses and prop state sprites.
- "A sprout grows" and "village amazed" are the high-value moments: prop state and group reactions are cheaper than complex character animation and carry the story. Prioritise them.

### Gaps
- Real Mixamo/TalkingHead/engine animation-graph name lists not retrieved.

---

## 3. Procedural animation for a 2D Canvas rig

### Takeaway
A flat-shaded puppet rig (body, head, 2-bone arms and legs, tail/ears as chains) driven by pose-to-pose keyposes with spring/ease interpolation, plus a procedural walk cycle (bob + limb swing + squash), gives acceptable motion at low cost. Use FK with hand-authored keyposes for most actions and analytic 2-bone IK only for feet planting and reaching props.

### Cited Findings
- The 12 principles (Johnston and Thomas, *The Illusion of Life*, 1981): squash and stretch, anticipation, staging, straight-ahead and pose-to-pose, follow through and overlapping action, slow in/out, arcs, secondary action, timing, exaggeration, solid drawing, appeal. Anticipation example: knees bend before a jump; slow in/out = easing; volume should stay constant when squashing. — [LottieFiles guide](https://lottiefiles.com/blog/tips-and-tutorials/mastering-disney-12-principles-animation), [Binus](https://binus.ac.id/bandung/dkv/2025/11/03/the-12-principles-of-animation-disneys-secret-formula-for-believable-motion/), [Open Culture](https://openculture.com/2015/04/disneys-12-timeless-principles-of-animation-demonstrated-in-12-animated-primers.html)
- Open-source 2-bone IK exists as Godot add-on (MIT per asset library); a 2D procedural IK walk demo exists (licence unverified). No JS/Canvas MIT library found in my search. — [Souperior 2D (Godot asset library)](https://godotengine.org/asset-library/asset/edit/10883), [2D procedural walk demo](https://moynilr.itch.io/2d-procedural-ik-walk-demo)
- Our own earlier research favoured a custom layered puppet rig in `renderFrame` with zero dependencies. **[prior]** `characters_animation_lipsync.md`.

### Techniques (inference, standard practice)
- Pose as `{rootX, rootY, bodyRot, headRot, armL:[shoulder,elbow], armR, legL, legR, squash, tailPhase}`; an action = list of keyposes `{t01, pose, ease}`; evaluate by interpolating between neighbours. This is pure function of local time.
- Layers evaluated in order: idle (breath, blink, tail sway; phase from global t) + locomotion (walk phase from distance travelled, not time, so feet match speed) + action pose (override mask per limb: e.g. `dig` overrides arms, not legs) + expression (face only) + secondary (spring on tail/ears driven by root velocity, computed analytically from the position function, not simulated).
- Blend: cross-fade pose weights over 0.15-0.25 s at action start/end; anticipation = first keypose is a small opposite move; overshoot = easeOutBack or critically-under-damped spring closed form (`1 - e^{-zt}(cos wt + ...)`), which is seekable.
- Secondary motion without simulation: tail angle = k * (lagged root velocity), where lagged velocity is root position sampled at t - delay (a pure function). Same trick for ears, hair, scarf.
- Walk: phase = distance / stride; leg angle = A sin(phase), opposite phase for the other leg; body bob = |sin(phase)|*b; slight squash at foot contact; arm swing opposite legs. FK is enough at 17 characters of cartoon proportions; IK only to pin hands on a prop.
- Effort (inference): rig + walk/run/idle/wave/jump/point/nod/dig/pick_up/plant, for ONE character type, around 4-6 working days incl. tuning; each extra species needs ~1 day for pose tuning if limb layout is shared (humanoid/quadruped templates). Props state sprites reuse the existing drawn props.

### Gaps
- No MIT/Apache JS/Canvas procedural walk reference found; implement from principles. No Pixi/Phaser/Spine-runtime licence check done (Spine runtimes are licensed separately, avoid).

---

## 4. Timeline engine design

### Takeaway
Use seconds as the base unit with narration-aligned `beats`; actions are intervals on per-subject tracks; the engine resolves a deterministic "layout pass" (compute start/end and positions) into a flat compiled timeline, then `stateAt(t)` is a pure function that finds each subject's active segment and evaluates it.

### Cited findings
- Scratch's `glide` (position over seconds), Animaker Action+ (ordered chain per character), `an` (tweens on named targets flattened to canonical timeline) all point to the same compiled-tween model. — links in section 1.
- Determinism and seekable pure render function: **[prior]** `rendering_engines_and_determinism.md`.

### Design (inference)
1. Authoring JSON: `beats[]` (narration sentences with start/end from TTS or estimate), `tracks` keyed by subject, each a list of actions with `at: {beat: "b3", offset: 0.5}` or `after: "actionId"` or absolute `t`. No dependency cycles (validator).
2. Compile (deterministic, run once per edit): resolve `after`/`beat` to seconds; run movement planning (walk_to target to coordinates through slots, duration = distance / speed, clamped); insert implicit transitions (turn toward walk direction, idle between actions); stretch/squash durations to fit beat length within bounds [0.5x, 1.5x]; emit flat segments `{subject, t0, t1, verb, params, startState}`.
3. State at time t: for an actor, find the walk/movement segment (position is a function of t via ease), find the body action segment (pose), the face segment, the held props (carry attaches prop to hand joint). Position continuity: each segment's start position = previous segment's end (computed in compile), so seeking anywhere is O(segments) without simulating.
4. Prop state: piecewise-constant stage with transitions (`grow` interpolates scale between stages); props attached (`carry`) evaluate relative to actor joint at t.
5. Camera: segments of `{mode, target, amount}`; follow = smoothed target position computed analytically from actor position function with a lag window (pure).
6. Randomness: seeded hash of (subjectId, name, floor(t*k)); no `Math.random`, no `Date.now`.
7. Narration alignment: durations scale with the beat; if the beat is shorter than the minimum total of its actions, validator warns and the compile drops optional actions (flagged `optional`).
8. Timeline vs simulation: do NOT simulate physics (throw arcs are closed-form parabolas); any dynamic effect must be a closed form function of t.

### Validator rules (inference; all checkable without an LLM)
- Verb in vocabulary; args pass per-verb schema (Zod); ids refer to existing actors/props/slots.
- Reachability: `walk_to` target slot inside scene bounds; `pick_up` requires prop at actor's location at that time (tracked by a symbolic state pass); a prop can be held by at most one actor; `plant` requires `dig` before; `cover` requires planted; `water`/`grow` requires planted seed.
- No overlapping body-action segments on the same actor (movement and face may overlap with body actions per layer mask); gestures during walk allowed only for `wave/point/nod/speak`.
- Duration bounds per verb (e.g. walk 0.5-6 s, dig 1-4 s, react 0.4-2 s); total <= 30 s; at most N actors on screen (e.g. 4 + crowd).
- Max actions per beat; at most one camera move at a time; no cut within 1 s of another cut.
- Auto-repair rather than reject: clamp, add missing `pick_up` / `enter`, reorder; report repairs to user (human edits locked, per project rules).

### Gaps
- Not checked: how Rive, Lottie or Spine handle beats/dependencies; no benchmark of timeline libraries.

---

## 5. Layout and staging in 9:16

### Takeaway
Use a vertical stage with 3 depth bands and 3-5 horizontal slots, keep the action in the middle vertical band, and reserve captions to a fixed band outside the platform UI zones. Third-party safe-zone numbers conflict, so use the conservative envelope and make it configurable.

### Cited Findings
- No official YouTube safe-zone spec found. Third-party guides: bottom 15% (~288 px on 1080x1920), 20% (~380 px), up to 35% (conservative); top ~15% (~180 px); right edge 48-140 px depending on source. Conservative advice: keep key content in the central band, out of bottom 15-20% and top 15%, and away from the right action column. — [ClipSpeed](https://www.clipspeed.ai/blog/youtube-shorts-size.html), [PostMyPost](https://postmypost.io/resources/vertical-video-2026-safe-zones-text-and-editing-how-to-create-content-that-doesn-t-cut-through-algorithms/), [VideoStew](https://videostew.com/blog/33443-youtube-shorts-aspect-ratio-and-layout-guide-2025), [BlitzCut](https://blitzcutai.com/blog/best-caption-size-youtube-shorts-2026)
- Existing Introcut caption/safe-area decisions: see earlier notes **[prior]** `visual_styles_by_code.md`.

### Design (inference)
- Canvas 1080x1920. Safe rect: x 60..1000 (leave right 80), y 290..1500 (top 15%, bottom ~22%). Captions at y 1150-1450 band or top band y 300-500 depending on scene; characters stand on ground line ~ y 1300 so feet clear of captions? Conflict: pick one of caption-top or caption-mid band per project (setting) and keep ground line at ~65% height with characters 400-600 px tall.
- Slots: `left` (x=0.22), `center` (0.5), `right` (0.78); depth `back` (scale 0.6, higher y), `mid` (1.0), `front` (1.25). 3x3 grid gives 9 named positions; also `offscreen_left/right` for enter/exit. Crowds use `back` row.
- Camera framing rules: default wide (zoom 1) shows two actors at once; push_in max 1.4x; follow keeps the actor in the central third; never let a speaking/acting actor leave the safe rect (validator on compiled positions plus camera transform).
- Text near moving characters: captions in a fixed band, characters avoid it by slot choice; if a character's head enters the caption band, validator warns or camera tilt down.

### Gaps
- No evidence found on how Vyond/Animaker handle vertical framing; not searched.

---

## 6. What "good enough" looks like

### Takeaway
I found no primary evidence on audience acceptance of simple 2D animation in Shorts; the points below are reasoning from animation craft and the Plotagon criticism, so mark as hypotheses to test with the eval.

### Cited Findings
- Plotagon's early coverage criticised "wooden", Sims-like motion and limited choices (2013). — [Concrete Playground](https://concreteplayground.com/perth/design-style/technology/plotagon-turns-your-words-into-an-animated-movie/amp)
- Hera analysis flags "edit friction and output quality concerns" as risk (June 2026). — [Airframe](https://www.airframe.ai/product/hera-video/analysis)
- Principles that most affect perceived quality: timing, anticipation, easing, follow-through (12 principles sources in section 3).

### Inferences (hypotheses)
- Features that matter most: every narration beat has a visible, readable action; actions start on the beat (timing); eases not linear; a reaction shot after each key event; sound effects on actions (dig thud, pop, whoosh) and music; camera emphasis on the payoff.
- Minimum feature set to feel like a story: entrance, locomotion, one manipulation action chain, prop state change, an emotion/reaction, a camera move, and a payoff beat.
- Cheap-looking mistakes: linear motion, characters sliding without a walk cycle (foot sliding), actions with no anticipation, props teleporting, everything at constant speed, empty frames while narration continues, captions overlapped by characters, text off safe zone, cuts every second with no continuity, all reactions identical.

### Gaps
- No creator breakdowns or retention data retrieved. A small A/B test with real viewers is the only way to learn this.

---

## 7. Draft JSON schema (v0) with the monkey-garlic example

```json
{
  "storyAnimation": {
    "version": 0,
    "canvas": {"w": 1080, "h": 1920, "fps": 30},
    "style": {"palette": "storybook", "captionBand": "bottom"},
    "scenes": {
      "edge": {"backdrop": "village_edge", "time": "day"},
      "field": {"backdrop": "field", "time": "day"},
      "village": {"backdrop": "village", "time": "dusk"}
    },
    "actors": {
      "monkey": {"rig": "monkey", "start": {"slot": "off_left"}},
      "v1": {"rig": "villager_a", "start": {"slot": "off_right"}},
      "v2": {"rig": "villager_b", "start": {"slot": "off_right"}}
    },
    "props": {
      "garlic": {"sprite": "garlic_clove", "at": {"slot": "mid_left"}},
      "straw":  {"sprite": "straw_bundle", "at": {"slot": "mid_right"}},
      "hole":   {"sprite": "hole", "state": "none", "at": {"slot": "mid_center"}},
      "sprout": {"sprite": "garlic_sprout", "state": "hidden", "at": {"slot": "mid_center"}}
    },
    "beats": [
      {"id": "b1", "text": "A little monkey walked to a field.", "t0": 0.0, "t1": 5.0},
      {"id": "b2", "text": "He dug a hole and planted a garlic clove.", "t0": 5.0, "t1": 12.0},
      {"id": "b3", "text": "He covered it with straw.", "t0": 12.0, "t1": 16.0},
      {"id": "b4", "text": "A sprout grew.", "t0": 16.0, "t1": 21.0},
      {"id": "b5", "text": "The whole village was amazed.", "t0": 21.0, "t1": 30.0}
    ],
    "tracks": {
      "camera": [
        {"id": "c1", "verb": "camera", "mode": "cut", "scene": "edge", "framing": "wide", "at": {"beat": "b1", "offset": 0}},
        {"id": "c2", "verb": "camera", "mode": "follow", "target": "monkey", "at": {"beat": "b1", "offset": 1.0}, "dur": 2.0},
        {"id": "c3", "verb": "camera", "mode": "cut", "scene": "field", "at": {"beat": "b1", "offset": 3.5}},
        {"id": "c4", "verb": "camera", "mode": "push_in", "target": "sprout", "amount": 1.3, "at": {"beat": "b4", "offset": 0.5}, "dur": 2.0},
        {"id": "c5", "verb": "camera", "mode": "cut", "scene": "village", "at": {"beat": "b5", "offset": 0}}
      ],
      "monkey": [
        {"id": "m1", "verb": "enter", "from": "left", "to": "left", "at": {"beat": "b1", "offset": 0.2}, "dur": 0.8, "emotion": "happy"},
        {"id": "m2", "verb": "walk_to", "to": {"slot": "center"}, "after": "m1", "dur": 2.0},
        {"id": "m3", "verb": "dig", "at": {"prop": "hole"}, "at_t": {"beat": "b2", "offset": 0}, "dur": 3.0},
        {"id": "m4", "verb": "pick_up", "prop": "garlic", "after": "m3", "dur": 1.0},
        {"id": "m5", "verb": "plant", "prop": "garlic", "at": {"prop": "hole"}, "after": "m4", "dur": 1.5},
        {"id": "m6", "verb": "pick_up", "prop": "straw", "at_t": {"beat": "b3", "offset": 0}, "dur": 0.8},
        {"id": "m7", "verb": "cover", "at": {"prop": "hole"}, "with": "straw", "after": "m6", "dur": 2.0},
        {"id": "m8", "verb": "feel", "emotion": "proud", "after": "m7", "dur": 1.0},
        {"id": "m9", "verb": "react", "kind": "amazed", "look_at": "sprout", "at": {"beat": "b4", "offset": 3.5}, "dur": 1.5},
        {"id": "m10", "verb": "wave", "at": {"beat": "b5", "offset": 3.5}, "dur": 2.0}
      ],
      "v1": [
        {"id": "a1", "verb": "enter", "from": "right", "to": {"slot": "right"}, "at": {"beat": "b5", "offset": 0.3}, "dur": 1.0},
        {"id": "a2", "verb": "react", "kind": "amazed", "after": "a1", "dur": 1.5},
        {"id": "a3", "verb": "clap", "after": "a2", "dur": 2.0}
      ],
      "v2": [
        {"id": "b1x", "verb": "enter", "from": "right", "to": {"slot": "center_back"}, "at": {"beat": "b5", "offset": 0.6}, "dur": 1.0},
        {"id": "b2x", "verb": "react", "kind": "cheer", "after": "b1x", "dur": 2.0}
      ],
      "hole":   [{"id": "h1", "verb": "set_state", "state": "open",   "after": "m3"},
                 {"id": "h2", "verb": "set_state", "state": "closed", "after": "m7"}],
      "sprout": [{"id": "s1", "verb": "appear", "fx": "pop", "at": {"beat": "b4", "offset": 0}},
                 {"id": "s2", "verb": "grow", "from": 0.2, "to": 1.0, "stages": 3, "after": "s1", "dur": 2.5},
                 {"id": "s3", "verb": "glow", "mode": "pulse", "after": "s2", "dur": 1.0}],
      "env": [{"id": "e1", "verb": "time_of_day", "to": "dusk", "at": {"beat": "b3", "offset": 0.5}, "dur": 3.0}]
    },
    "sfx": [{"on": "m3", "sound": "dig"}, {"on": "s1", "sound": "pop"}, {"on": "a3", "sound": "cheer"}]
  }
}
```
Notes: `at` is a time anchor in beat+offset or absolute seconds; `after` means start when the referenced action ends; positions are slots, never pixels. The example is illustrative; dur values would be rescaled to beat lengths at compile time. Zod discriminated union on `verb` gives per-verb arg validation. Property naming (`at` used both for time and place) should be split before implementation (`when` vs `where`), flagged.

---

## 8. A 2-3 week build plan (inference; estimates, not measured)

| Week | Milestone | Acceptance test |
|---|---|---|
| 1a | Schema + compiler + `stateAt(t)` skeleton; slots; beats; 3 verbs (enter, walk_to, idle) | Same JSON gives byte-identical frames at t=3.2 in two runs; seek back and forth gives same state |
| 1b | Puppet rig for ONE shared humanoid template (monkey): layered pose, walk cycle, tail secondary, blink | Walk 2 s with no foot sliding (foot speed equals ground speed within 5%); screenshot review |
| 2a | 10 actions: dig, pick_up, plant, cover, wave, point, nod, jump, react(amazed), feel | Each action renders in isolation against a golden frame set at t=0, 25, 50, 75, 100% |
| 2b | Prop states (hole, sprout grow, appear/glow, carry attach), camera (cut, push_in, pull_out, follow), time_of_day | Monkey story renders end-to-end from hand-written JSON, 30 s |
| 3a | Validator + auto-repair + narration alignment | 50 mutated JSONs (overlaps, unreachable pick_up, cycles, over-long) all caught or repaired; no crash |
| 3b | AI fill: prompt with vocabulary + few-shot, constrained JSON (Zod), repair loop <= 2 retries; eval set of 20 stories | >= 80% of stories yield a valid timeline after repair; 3 humans rate "does it show the story" on a 1-5 scale, median >= 3.5 (target, not evidence) |

Risks: (1) one rig does not cover 17 characters: use two templates (biped, quadruped) and map species through parameters; (2) AI plans physically inconsistent chains: symbolic state check; (3) narration timing too short for actions: optional actions and bounded stretch; (4) time overrun on hand-tuned poses: limit to 10 actions, cut `throw/give/push/eat`; (5) quality perception: hold a daily visual review with 5 reference clips; (6) small LLMs (WebLLM Qwen3) may fail strict JSON: grammar-constrained output or rule-based fallback, as in earlier note **[prior]** `llm_scene_spec_design.md`.

Licences: everything above is own code plus existing drawn assets; no new dependency required. If any rig/IK library is added, check licence (Godot MIT add-ons are not usable in JS directly). Mixamo, Spine and Live2D are not allowed (licence).

---

## Gaps (overall)
- No primary evidence on audience acceptance, vertical framing in competitors, MovieAgent/Text2Animation/Scratch-agent papers, Mixamo/TalkingHead vocab lists, or an MIT JS procedural walk reference.
- The PyPI `an` project is the nearest analogue; read its schema and licence before finalising ours.
