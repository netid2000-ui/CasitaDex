import { stageMedia, type MediaStore } from "./media-staging";
import type { MediaEntry } from "./media-manifest";
import type { Database } from "./sqlite-repository";
import { recordMediaOperation, advanceMediaOperation, listIncompleteMedia } from "./media-journal";
import { attachMedia } from "./media-sqlite";
/** Opt-in workflow; requires media tables prepared and a caller-serialized database. */
export async function attachWithJournal(db: Database, store: MediaStore, entry: MediaEntry, bytes: Uint8Array,
  sha256: (bytes: Uint8Array) => Promise<string>) {
  await recordMediaOperation(db, entry);
  await stageMedia(store, entry, bytes, sha256);
  await advanceMediaOperation(db, entry.id, "pending", "promoted");
  // Metadata commit and final journal state are separate, so recovery must be read-only on uncertainty.
  await attachMedia(db, entry);
  await advanceMediaOperation(db, entry.id, "promoted", "committed");
}
/** Incomplete operations are reported for triage, never automatically deleted. */
export async function inspectInterruptedMedia(db: Database) {
  const items = await listIncompleteMedia(db);
  return items.map(item => ({ id: item.entry.id, path: item.entry.path, phase: item.phase,
    action: "Inspect file and committed SQLite references before retry or cleanup" as const }));
}