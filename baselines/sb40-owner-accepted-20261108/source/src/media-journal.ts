import type { Database, SQL } from "./sqlite-repository";
import { validateMediaManifest, type MediaEntry } from "./media-manifest";
export type MediaPhase = "pending" | "promoted" | "committed";
export interface MediaOperation { entry: MediaEntry; phase: MediaPhase }
/** Companion journal: opt-in, distinct from text-v1 database migration. */
export async function prepareMediaJournal(db: Database) {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS media_ops_v2 (
    id TEXT PRIMARY KEY NOT NULL, card_id TEXT NOT NULL,
    relative_path TEXT NOT NULL, mime TEXT NOT NULL,
    byte_count INTEGER NOT NULL, sha256 TEXT NOT NULL,
    phase TEXT NOT NULL CHECK(phase IN ('pending','promoted','committed'))
  );`);
}
export async function recordMediaOperation(db: Database, entry: MediaEntry) {
  const safe = validateMediaManifest({version:2,media:[entry]},[entry.cardId]).media[0];
  await db.withExclusiveTransactionAsync(async (tx: SQL) => {
    await tx.runAsync("INSERT INTO media_ops_v2 (id,card_id,relative_path,mime,byte_count,sha256,phase) VALUES (?,?,?,?,?,?,?)",
      safe.id,safe.cardId,safe.path,safe.mime,safe.bytes,safe.sha256,"pending");
  });
}
export async function advanceMediaOperation(db: Database, id: string, from: MediaPhase, to: MediaPhase) {
  if (!((from === "pending" && to === "promoted") || (from === "promoted" && to === "committed"))) throw Error("Invalid media transition");
  await db.withExclusiveTransactionAsync(async tx => {
    const row=await tx.getFirstAsync<{phase: string}>("SELECT phase FROM media_ops_v2 WHERE id=?",id);
    if (!row || row.phase !== from) throw Error("Media phase mismatch");
    await tx.runAsync("UPDATE media_ops_v2 SET phase=? WHERE id=? AND phase=?",to,id,from);
  });
}
export async function listIncompleteMedia(db: Database): Promise<MediaOperation[]> {
  const rows=await db.getAllAsync<{id:string;card_id:string;relative_path:string;mime:string;byte_count:number;sha256:string;phase:MediaPhase}>(
    "SELECT * FROM media_ops_v2 WHERE phase != 'committed' ORDER BY id");
  return rows.map(r=>({entry:validateMediaManifest({version:2,media:[{id:r.id,cardId:r.card_id,path:r.relative_path,mime:r.mime,bytes:r.byte_count,sha256:r.sha256}]},[r.card_id]).media[0],phase:r.phase}));
}