import { stageMedia, type MediaStore } from "./media-staging";
import type { MediaEntry } from "./media-manifest";
/** Coordinates file promotion before metadata commit; never deletes a promoted file on DB uncertainty. */
export async function addVerifiedAttachment(
  store: MediaStore,
  entry: MediaEntry,
  bytes: Uint8Array,
  sha256: (bytes: Uint8Array) => Promise<string>,
  persist: (entry: MediaEntry) => Promise<void>,
): Promise<void> {
  await stageMedia(store, entry, bytes, sha256);
  try {
    await persist(entry);
  } catch (cause) {
    // Unknown database outcomes must not trigger deletion: reconcile offline using committed references.
    throw new Error("Attachment metadata was not confirmed; promoted file retained for reconciliation", { cause });
  }
}
/** Reconcilers may delete only after independently checking committed and recoverable references. */
export async function reconcileMedia(
  store: MediaStore, candidates: readonly string[],
  readProtectedPaths: () => Promise<ReadonlySet<string>>,
): Promise<string[]> {
  const protectedPaths = await readProtectedPaths();
  const pending: string[] = [];
  for (const path of candidates) {
    if (!/^media\/[A-Za-z0-9_-]{1,100}\.(jpg|png|webp)$/.test(path)) throw new Error("Unsafe candidate path");
    if (!protectedPaths.has(path)) pending.push(path);
  }
  // Return candidates for a separately authorized cleanup; no automatic deletion.
  return pending;
}