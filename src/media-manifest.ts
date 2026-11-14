export const mediaEntryLimit=1000;
export const mediaFileLimit=10_000_000;
/** Validation-only media manifest. No migration, file I/O, or restore is performed here. */
export interface MediaEntry {
  id: string;
  cardId: string;
  path: string;
  mime: "image/jpeg" | "image/png" | "image/webp";
  bytes: number;
  sha256: string;
}
export interface MediaManifest {
  version: 2;
  media: MediaEntry[];
}
const idPattern = /^[A-Za-z0-9_-]{1,100}$/;
const hashPattern = /^[a-f0-9]{64}$/;
const suffixes: Record<MediaEntry["mime"], string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
const allowed = new Set(Object.keys(suffixes));
export function validateMediaManifest(input: unknown, cardIds: readonly string[]): MediaManifest {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid media manifest");
  const value = input as Record<string, unknown>;
  if (value.version !== 2 || !Array.isArray(value.media) || value.media.length > mediaEntryLimit)
    throw new Error("Unsupported media manifest version or count");
  const cards = new Set(cardIds);
  const ids = new Set<string>();
  const paths = new Set<string>();
  let total = 0;
  const media: MediaEntry[] = [];
  for (const item of value.media) {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Invalid media entry");
    const m = item as Record<string, unknown>;
    if (typeof m.id !== "string" || !idPattern.test(m.id) || ids.has(m.id)) throw new Error("Invalid or duplicate media ID");
    if (typeof m.cardId !== "string" || !cards.has(m.cardId)) throw new Error("Missing media card reference");
    if (typeof m.mime !== "string" || !allowed.has(m.mime)) throw new Error("Unsupported media type");
    if (typeof m.path !== "string" || m.path !== `media/${m.id}${suffixes[m.mime as MediaEntry["mime"]]}` || paths.has(m.path)) throw new Error("Unsafe or duplicate media path");
    if (!Number.isSafeInteger(m.bytes) || (m.bytes as number) < 1 || (m.bytes as number) > mediaFileLimit) throw new Error("Invalid media size");
    total += m.bytes as number;
    if (!Number.isSafeInteger(total)) throw new Error("Invalid media total");
    if (typeof m.sha256 !== "string" || !hashPattern.test(m.sha256)) throw new Error("Invalid media digest");
    ids.add(m.id); paths.add(m.path);
    media.push({ id: m.id, cardId: m.cardId, path: m.path, mime: m.mime as MediaEntry["mime"], bytes: m.bytes as number, sha256: m.sha256 });
  }
  return { version: 2, media };
}