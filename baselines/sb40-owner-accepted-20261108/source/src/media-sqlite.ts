import { validateMediaManifest, type MediaEntry } from "./media-manifest";
import type { Database, SQL } from "./sqlite-repository";
/** Opt-in companion table: leaves v1 collection schema and exports unchanged. */
export async function prepareMediaTable(db: Database): Promise<void> {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS media_v2 (
    id TEXT PRIMARY KEY NOT NULL,
    card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE RESTRICT,
    relative_path TEXT NOT NULL UNIQUE,
    mime TEXT NOT NULL,
    byte_count INTEGER NOT NULL CHECK(byte_count > 0 AND byte_count <= 10000000),
    sha256 TEXT NOT NULL
  );`);
}
export async function attachMedia(db: Database, entry: MediaEntry): Promise<void> {
  const safe = validateMediaManifest({ version: 2, media: [entry] }, [entry.cardId]).media[0];
  await db.withExclusiveTransactionAsync(async (tx: SQL) => {
    const card = await tx.getFirstAsync<{ id: string }>("SELECT id FROM cards WHERE id = ?", safe.cardId);
    if (!card) throw new Error("Parent card not found");
    await tx.runAsync("INSERT INTO media_v2 (id, card_id, relative_path, mime, byte_count, sha256) VALUES (?, ?, ?, ?, ?, ?)",
      safe.id, safe.cardId, safe.path, safe.mime, safe.bytes, safe.sha256);
  });
}
export async function listAttachedMedia(db: Database, cardId: string): Promise<MediaEntry[]> {
  const rows = await db.getAllAsync<{id:string;card_id:string;relative_path:string;mime:string;byte_count:number;sha256:string}>(
    "SELECT id, card_id, relative_path, mime, byte_count, sha256 FROM media_v2 WHERE card_id = ? ORDER BY id",cardId);
  return validateMediaManifest({version:2,media:rows.map(r=>({id:r.id,cardId:r.card_id,path:r.relative_path,mime:r.mime,bytes:r.byte_count,sha256:r.sha256}))},[cardId]).media;
}/** Metadata and journal completion MUST commit within the same transaction. */
export async function commitMediaWithJournal(db: Database, entry: MediaEntry): Promise<void> {
  const safe = validateMediaManifest({ version: 2, media: [entry] }, [entry.cardId]).media[0];
  await db.withExclusiveTransactionAsync(async (tx: SQL) => {
    const op = await tx.getFirstAsync<{phase:string;relative_path:string;sha256:string}>(
      "SELECT phase, relative_path, sha256 FROM media_ops_v2 WHERE id=?",safe.id);
    if (!op || op.phase !== "promoted" || op.relative_path !== safe.path || op.sha256 !== safe.sha256)
      throw new Error("Promoted media journal does not match entry");
    const parent = await tx.getFirstAsync<{id:string}>("SELECT id FROM cards WHERE id=?",safe.cardId);
    if (!parent) throw new Error("Parent card not found");
    await tx.runAsync("INSERT INTO media_v2 (id,card_id,relative_path,mime,byte_count,sha256) VALUES (?,?,?,?,?,?)",
      safe.id,safe.cardId,safe.path,safe.mime,safe.bytes,safe.sha256);
    await tx.runAsync("UPDATE media_ops_v2 SET phase='committed' WHERE id=? AND phase='promoted'",safe.id);
  });
}