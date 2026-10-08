export type Context = "Buy" | "Fix" | "Find" | "Maintain";
export type Confidence = "Verified" | "Needs checking" | "Unknown";
export interface Space {
  id: string;
  name: string;
}
export interface HistoryEntry {
  id: string;
  date: string;
  action: string;
}
export interface MediaReference {
  id: string;
  cardId: string;
  localUri: string;
}
export interface Card {
  id: string;
  spaceId: string;
  title: string;
  answer: string;
  location: string;
  notes: string;
  context: Context;
  confidence: Confidence;
  source: string;
  verifiedAt?: string;
  due?: string;
  history: HistoryEntry[];
  demo?: boolean;
}
export interface Data {
  version: 1;
  spaces: Space[];
  cards: Card[];
  media: MediaReference[];
}
export const empty = (): Data => ({
  version: 1,
  spaces: [{ id: "home", name: "My Home" }],
  cards: [],
  media: [],
});
export const contexts: Context[] = ["Buy", "Fix", "Find", "Maintain"];
export const confidences: Confidence[] = [
  "Unknown",
  "Needs checking",
  "Verified",
];
export function matches(
  c: Card,
  query: string,
  mode: string,
  today: string,
): boolean {
  const content = [c.title, c.answer, c.location, c.notes]
    .join(" ")
    .toLocaleLowerCase();
  return (
    content.includes(query.trim().toLocaleLowerCase()) &&
    (mode === "All" ||
      mode === "Share" ||
      (mode === "Maintain" ? !!c.due && c.due <= today : c.context === mode))
  );
}
export function snapshot(
  cards: Card[],
  ids: string[],
  details: boolean,
): string {
  return cards
    .filter((c) => ids.includes(c.id))
    .map((c) =>
      [
        c.demo ? "EXAMPLE DATA" : "",
        c.title,
        c.answer,
        c.confidence,
        details
          ? [
              c.location,
              c.notes,
              ...c.history.map((h) => h.date + " · " + h.action),
            ]
              .filter(Boolean)
              .join("\n")
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}
function text(v: unknown, max = 4000): v is string {
  return typeof v === "string" && v.length <= max;
}
function date(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    !isNaN(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v
  );
}
export function utf8Bytes(value: string): number {
  let count = 0;
  for (const character of value) {
    const code = character.codePointAt(0)!;
    count += code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4;
  }
  return count;
}
export function parseData(raw: string): Data {
  if (raw.length > 2000000 || utf8Bytes(raw) > 2000000)
    throw new Error("Backup is too large. Maximum size is 2 MB.");
  const d = JSON.parse(raw);
  if (
    d?.version !== 1 ||
    !Array.isArray(d.spaces) ||
    !d.spaces.length ||
    !Array.isArray(d.cards) ||
    d.cards.length > 5000 ||
    !Array.isArray(d.media) ||
    d.media.length
  )
    throw new Error(
      "Use a version 1 CasitaDex text backup. Media restore is not available in this prototype.",
    );
  const ids = new Set<string>();
  for (const s of d.spaces) {
    if (
      !text(s.id, 100) ||
      !s.id ||
      ids.has(s.id) ||
      !text(s.name, 200) ||
      !s.name.trim()
    )
      throw new Error("Invalid spaces.");
    ids.add(s.id);
  }
  const cardIds = new Set<string>();
  for (const c of d.cards) {
    if (
      !text(c.id, 100) ||
      !c.id ||
      cardIds.has(c.id) ||
      !ids.has(c.spaceId) ||
      !text(c.title, 200) ||
      !c.title.trim() ||
      !text(c.answer, 1000) ||
      !c.answer.trim() ||
      !text(c.location) ||
      !text(c.notes) ||
      !text(c.source, 200) ||
      !contexts.includes(c.context) ||
      !confidences.includes(c.confidence) ||
      !Array.isArray(c.history) ||
      c.history.length > 10000 ||
      (c.due !== undefined && !date(c.due)) ||
      (c.verifiedAt !== undefined && !date(c.verifiedAt)) ||
      (c.demo !== undefined && typeof c.demo !== "boolean")
    )
      throw new Error("A card contains missing or invalid information.");
    if (c.confidence === "Verified" && (!c.source.trim() || !c.verifiedAt))
      throw new Error("Verified cards need a source and verification date.");
    for (const h of c.history)
      if (!text(h.id, 100) || !date(h.date) || !text(h.action, 4000))
        throw new Error("Invalid history.");
    cardIds.add(c.id);
  }
  // Allowlisted copies prevent unknown imported properties from entering later exports.
  return {
    version: 1,
    spaces: d.spaces.map((s: Space) => ({ id: s.id, name: s.name })),
    media: [],
    cards: d.cards.map((c: Card) => ({
      id: c.id,
      spaceId: c.spaceId,
      title: c.title,
      answer: c.answer,
      location: c.location,
      notes: c.notes,
      source: c.source,
      context: c.context,
      confidence: c.confidence,
      ...(c.due ? { due: c.due } : {}),
      ...(c.verifiedAt ? { verifiedAt: c.verifiedAt } : {}),
      ...(c.demo ? { demo: true } : {}),
      history: c.history.map((h) => ({
        id: h.id,
        date: h.date,
        action: h.action,
      })),
    })),
  };
}
export function examples(): Data {
  const d = empty();
  d.cards = [
    {
      id: "demo-filter",
      spaceId: "home",
      title: "HVAC filter",
      answer: "20 × 25 × 1",
      location: "Hall closet ceiling",
      notes: "MERV 11. Check the equipment label before buying.",
      context: "Buy",
      confidence: "Verified",
      source: "Example label",
      verifiedAt: "2026-09-01",
      due: "2026-10-07",
      history: [
        { id: "h1", date: "2026-09-01", action: "Filter changed (example)" },
      ],
      demo: true,
    },
    {
      id: "demo-paint",
      spaceId: "home",
      title: "Living-room paint",
      answer: "SW 7036 · Eggshell",
      location: "Paint can on utility shelf",
      notes: "Confirm finish against the can.",
      context: "Buy",
      confidence: "Needs checking",
      source: "Previous-owner note (example)",
      history: [],
      demo: true,
    },
    {
      id: "demo-water",
      spaceId: "home",
      title: "Main water shutoff",
      answer: "Garage · left wall",
      location: "Beside the utility door",
      notes: "Location reference only. Confirm your own shutoff location.",
      context: "Find",
      confidence: "Needs checking",
      source: "Example note",
      history: [],
      demo: true,
    },
    {
      id: "demo-fridge",
      spaceId: "home",
      title: "Refrigerator filter",
      answer: "EDR4RXD1",
      location: "Kitchen refrigerator",
      notes:
        "Manual: kitchen document folder. Warranty details not yet recorded.",
      context: "Fix",
      confidence: "Unknown",
      source: "",
      history: [],
      demo: true,
    },
  ];
  return d;
}
