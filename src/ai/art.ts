// Chooses a picture for a line of the story from the words in it (a simple, honest keyword match, not "AI understanding").
// If no word matches, the line still gets a coloured backdrop with a star, so a scene is never just text on a plain card.
import { BACKDROPS, layoutItems, type Backdrop, type ItemKind, type PlacedItem } from "../render/art";

type Rule<T> = { to: T; words: string[] };

// Words are matched as substrings of the lower-cased line. English first, then common Nepali / Hindi words (Devanagari).
const ITEM_RULES: Rule<ItemKind>[] = [
  { to: "monkey", words: ["monkey", "ape", "chimp", "बाँदर", "बन्दर", "बंदर"] },
  { to: "farmer", words: ["farmer", "farm worker", "villager", "किसान", "कृषक"] },
  { to: "cat", words: ["cat ", "kitten", "बिरालो", "बिल्ली"] },
  { to: "garlic", words: ["garlic", "clove", "लसुन", "कोसा"] },
  { to: "seedling", words: ["seedling", "sprout", "shoot", "seed", "plant", "grow", "crop", "rows", "soil", "mud", "dig", "straw", "hay", "mulch", "बिरुवा", "बीउ", "रोप", "उमर", "टुसा", "पौधा", "माटो", "पराल"] },
  { to: "tree", words: ["tree", "forest", "wood", "रुख", "जंगल", "पेड़"] },
  { to: "house", words: ["house", "home", "village", "family", "घर", "गाउँ", "गांव", "परिवार"] },
  { to: "bucket", words: ["bucket", "carried water", "carry water", "well", "pump", "बाल्टी", "कुवा", "कुआँ"] },
  { to: "phone", words: ["phone", "app ", "online", "video", "reel", "social media", "screen", "फोन", "मोबाइल"] },
  { to: "coin", words: ["money", "price", "cost", "pay", "paid", "earn", "rupee", "dollar", "profit", "sell", "market", "पैसा", "रुपैयाँ", "कमाइ", "बजार", "पैसे"] },
  { to: "heart", words: ["love", "heart", "kind", "care", "thank", "माया", "प्रेम", "धन्यवाद", "दिल"] },
  { to: "book", words: ["book", "learn", "study", "lesson", "school", "teach", "read", "किताब", "सिक", "पढ"] },
  { to: "bulb", words: ["idea", "think", "thought", "secret", "trick", "tip", "discover", "आइडिया", "सोच", "विचार"] },
  { to: "sun", words: ["sun", "sunny", "morning", "sunrise", "bright", "घाम", "सूर्य", "बिहान", "सुबह"] },
  { to: "cloud", words: ["cloud", "overcast", "बादल"] },
  { to: "moon", words: ["moon", "night", "dark", "sleep", "चन्द्र", "रात", "अँध्यारो", "अंधेरा"] },
  { to: "star", words: ["star", "dream", "wish", "magic", "तारा", "सपना"] },
];

const BACKDROP_RULES: Rule<Backdrop>[] = [
  { to: "rain", words: ["rain", "storm", "monsoon", "flood", "drought", "वर्षा", "पानी पर", "बर्सा", "बारिश"] },
  { to: "night", words: ["night", "moon", "dark", "midnight", "रात", "अँध्यारो", "अंधेरा"] },
  { to: "river", words: ["river", "stream", "lake", "boat", "नदी", "खोला", "ताल"] },
  { to: "mountain", words: ["mountain", "himalaya", "hill", "climb", "peak", "पहाड", "हिमाल", "पर्वत"] },
  { to: "city", words: ["city", "office", "phone", "app ", "online", "shop", "traffic", "business", "सहर", "शहर", "अफिस", "दुकान"] },
  { to: "room", words: ["in the room", "bedroom", "living room", "classroom", "kitchen", "at his desk", "at her desk", "inside the house", "कोठा", "कमरा", "भित्र"] },
  { to: "dusk", words: ["evening", "sunset", "dusk", "साँझ", "सन्ध्या", "शाम"] },
  { to: "village", words: ["village", "home", "family", "neighbour", "neighbor", "गाउँ", "गांव", "परिवार"] },
  { to: "day", words: ["farm", "field", "garlic", "plant", "seed", "crop", "grow", "garden", "खेत", "लसुन", "बिरुवा", "किसान", "बगैंचा"] },
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\const has = (text: string, words: string[]) => words.some((w) => text.includes(w));");
const patterns = new Map<string, RegExp | string>();
/** English words match at the START of a word ("plant" finds "planted", but "love" does not match inside "clove"); a trailing space means the whole word. Devanagari is matched as plain text. */
function matches(text: string, word: string): boolean {
  let p = patterns.get(word);
  if (p === undefined) {
    p = /^[\x00-\x7f]+$/.test(word) ? new RegExp("\\b" + escapeRe(word.trim()) + (word.endsWith(" ") ? "\\b" : ""), "i") : word;
    patterns.set(word, p);
  }
  return typeof p === "string" ? text.includes(p) : p.test(text);
}
const has = (text: string, words: string[]) => words.some((w) => matches(text, w));

export interface ArtContext {
  backdrop?: Backdrop;
  /** The last character shown (monkey, farmer, cat), so "he" or "they" keeps showing the same one. */
  character?: ItemKind;
}

const CHARACTERS: ItemKind[] = ["monkey", "farmer", "cat"];
const PRONOUNS = [" he ", " she ", " they ", " his ", " her ", " him ", " them ", " it ", " उसले", " उनले", " उसको", " वह ", " उसने"];

/** Pick up to 3 things to draw (a character first, then props) and a backdrop for one line, using what came before. */
export function directArt(line: string, index: number, before?: ArtContext): { backdrop: Backdrop; items: PlacedItem[]; seed: number; character?: ItemKind } {
  const text = ` ${line.toLowerCase()} `;
  const kinds: ItemKind[] = [];
  for (const r of ITEM_RULES) if (kinds.length < 3 && has(text, r.words)) kinds.push(r.to);
  const order: ItemKind[] = ["monkey", "farmer", "cat", "garlic", "seedling", "tree", "house", "bucket", "phone", "coin", "heart", "book", "bulb", "sun", "cloud", "moon", "star"];
  kinds.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  if (kinds.includes("garlic") && kinds.includes("seedling")) kinds.splice(kinds.indexOf("seedling"), 1); // the garlic already says "planting"

  let backdrop: Backdrop | undefined;
  for (const r of BACKDROP_RULES) if (has(text, r.words)) { backdrop = r.to; break; }
  // The story continues: keep the last character when the line says "he/they", and keep the last scene's setting.
  const mentioned = kinds.find((k) => CHARACTERS.includes(k));
  const character = mentioned ?? (before?.character && (has(text, PRONOUNS) || kinds.length === 0) ? before.character : undefined);
  if (!mentioned && character && kinds.length < 3) kinds.unshift(character);
  if (!backdrop) backdrop = before?.backdrop && before.backdrop !== "abstract" ? before.backdrop : kinds.length === 0 ? "abstract" : "day";
  if (kinds.length === 0) kinds.push("star");
  // A rainy or night scene has no sun.
  const keep = kinds.filter((k) => !(k === "sun" && (backdrop === "night" || backdrop === "rain")));
  if (backdrop === "rain" && !keep.includes("cloud") && keep.length < 3) keep.push("cloud");
  const final = (keep.length ? keep : ["star" as ItemKind]).slice().sort((x, y) => order.indexOf(x) - order.indexOf(y));
  return { backdrop, items: layoutItems(final), seed: 1 + ((index * 7 + line.length) % 97), character: mentioned ?? character ?? before?.character };
}

export { BACKDROPS };
