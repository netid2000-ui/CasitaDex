import type { MediaEntry } from "./media-manifest";
/** Pure preflight for file bytes supplied by a future native adapter. */
export function sniffImageMime(bytes: Uint8Array): MediaEntry["mime"] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((x,i) => bytes[i] === x)) return "image/png";
  if (bytes.length >= 12 && [82,73,70,70].every((x,i)=>bytes[i]===x) && [87,69,66,80].every((x,i)=>bytes[i+8]===x)) return "image/webp";
  return null;
}
/** Does not write files or change SQLite. Digest is calculated by caller-provided adapter. */
export async function verifyMediaBytes(
  entry: MediaEntry,
  bytes: Uint8Array,
  calculateSha256: (bytes: Uint8Array) => Promise<string>,
): Promise<void> {
  if (!(bytes instanceof Uint8Array)) throw new Error("Invalid media bytes");
  if (bytes.byteLength !== entry.bytes || bytes.byteLength < 1 || bytes.byteLength > 10_000_000)
    throw new Error("Media byte count mismatch");
  if (sniffImageMime(bytes) !== entry.mime) throw new Error("Media signature mismatch");
  const hash = await calculateSha256(bytes);
  if (!/^[a-f0-9]{64}$/.test(hash) || hash !== entry.sha256)
    throw new Error("Media SHA-256 mismatch");
}