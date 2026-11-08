import { verifyMediaBytes } from "./media-integrity";
import type { MediaEntry } from "./media-manifest";
/** Injectable adapter: all paths are app-private, resolved by native implementation. */
export interface MediaStore {
  writeTemporary(id: string, bytes: Uint8Array): Promise<void>;
  readTemporary(id: string): Promise<Uint8Array>;
  promote(id: string, path: string): Promise<void>;
  removeTemporary(id: string): Promise<void>;
  removeUnreferenced(path: string): Promise<void>;
}
/** Stages a verified file; caller must separately commit metadata to SQLite. */
export async function stageMedia(
  store: MediaStore, entry: MediaEntry, bytes: Uint8Array,
  sha256: (bytes: Uint8Array) => Promise<string>,
): Promise<void> {
  await verifyMediaBytes(entry, bytes, sha256);
  let created = false;
  try {
    created = true;
    await store.writeTemporary(entry.id, bytes);
    const readBack = await store.readTemporary(entry.id);
    await verifyMediaBytes(entry, readBack, sha256);
    await store.promote(entry.id, entry.path);
  } catch (error) {
    if (created) {
      try { await store.removeTemporary(entry.id); }
      catch { throw new Error("Media staging failed; temporary file cleanup also failed", { cause: error }); }
    }
    throw error;
  }
}
/** Only caller-confirmed unreferenced media may be removed. */
export async function sweepMediaOrphans(store: MediaStore, candidates: readonly string[], referenced: ReadonlySet<string>) {
  for (const path of candidates) {
    if (!/^media\/[A-Za-z0-9_-]{1,100}\.(jpg|png|webp)$/.test(path)) throw new Error("Unsafe media cleanup path");
    if (!referenced.has(path)) await store.removeUnreferenced(path);
  }
}