import { empty, parseData, type Data } from "./model.ts";
import type { Storage } from "./repository.ts";
export interface SQL {
  execAsync(sql: string): Promise<void>;
  runAsync(
    sql: string,
    ...params: (string | number | null)[]
  ): Promise<unknown>;
  getFirstAsync<T>(
    sql: string,
    ...params: (string | number | null)[]
  ): Promise<T | null>;
  getAllAsync<T>(
    sql: string,
    ...params: (string | number | null)[]
  ): Promise<T[]>;
}
export interface Database extends SQL {
  withExclusiveTransactionAsync(
    task: (tx: SQL) => Promise<void>,
  ): Promise<void>;
}
const schema = `
PRAGMA journal_mode = WAL;
PRAGMA synchronous = FULL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS spaces (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, position INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS cards (id TEXT PRIMARY KEY NOT NULL, space_id TEXT NOT NULL REFERENCES spaces(id), position INTEGER NOT NULL, payload TEXT NOT NULL);
`;
export function sqliteRepository(
  db: Database,
  legacy: Storage,
  environment: string,
) {
  if (!["development", "staging"].includes(environment))
    throw new Error("Unsupported environment");
  const key = "casitadex:" + environment + ":v1";
  let queue: Promise<unknown> = Promise.resolve();
  function serial<T>(task: () => Promise<T>): Promise<T> {
    const pending = queue.then(task);
    queue = pending.catch(() => undefined);
    return pending;
  }
  async function marker(sql: SQL) {
    const row = await sql.getFirstAsync<{ value: string }>(
      "SELECT value FROM metadata WHERE key = 'schema'",
    );
    if (row && row.value !== "1")
      throw new Error(
        "This database needs a newer CasitaDex version. Nothing was changed.",
      );
    return row;
  }
  async function read(sql: SQL): Promise<Data> {
    const spaces = await sql.getAllAsync<{ id: string; name: string }>(
      "SELECT id, name FROM spaces ORDER BY position",
    );
    const rows = await sql.getAllAsync<{ payload: string }>(
      "SELECT payload FROM cards ORDER BY position",
    );
    return parseData(
      JSON.stringify({
        version: 1,
        spaces,
        cards: rows.map((r) => JSON.parse(r.payload)),
        media: [],
      }),
    );
  }
  async function replace(sql: SQL, data: Data) {
    // Legacy text-only replacement must not destroy cards referenced by media-v2.
    // A future media-aware replacement will stage and commit both datasets together.
    const mediaTable = await sql.getFirstAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='media_v2'",
    );
    if (mediaTable) {
      const count = await sql.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM media_v2");
      if (count && count.count > 0) {
        // Keep all attached parent rows. Apply ordinary collection edits in
        // place instead of deleting the whole table, which would lose images.
        const previous=await read(sql);
        const oldSpaces=new Set(previous.spaces.map(s=>s.id));
        const oldCards=new Set(previous.cards.map(c=>c.id));
        const nextSpaces=new Set(data.spaces.map(s=>s.id));
        const nextCards=new Set(data.cards.map(c=>c.id));
        for(const [i,space] of data.spaces.entries()) {
          if(oldSpaces.has(space.id))await sql.runAsync("UPDATE spaces SET name=?,position=? WHERE id=?",space.name,i,space.id);
          else await sql.runAsync("INSERT INTO spaces(id,name,position) VALUES(?,?,?)",space.id,space.name,i);
        }
        for(const [i,card] of data.cards.entries()) {
          if(oldCards.has(card.id))await sql.runAsync("UPDATE cards SET space_id=?,position=?,payload=? WHERE id=?",card.spaceId,i,JSON.stringify(card),card.id);
          else await sql.runAsync("INSERT INTO cards(id,space_id,position,payload) VALUES(?,?,?,?)",card.id,card.spaceId,i,JSON.stringify(card));
        }
        for(const old of previous.cards.filter(c=>!nextCards.has(c.id))) {
          const count=await sql.getFirstAsync<{n:number}>("SELECT COUNT(*) AS n FROM media_v2 WHERE card_id=?",old.id);
          if(count?.n)throw Error("This card has image attachments. Use media-aware backup and restore; text-only replacement is blocked.");
          await sql.runAsync("DELETE FROM cards WHERE id=?",old.id);
        }
        for(const old of previous.spaces.filter(s=>!nextSpaces.has(s.id)))await sql.runAsync("DELETE FROM spaces WHERE id=?",old.id);
        return;
      }
    }
    await sql.runAsync("DELETE FROM cards");
    await sql.runAsync("DELETE FROM spaces");
    for (const [index, space] of data.spaces.entries())
      await sql.runAsync(
        "INSERT INTO spaces (id, name, position) VALUES (?, ?, ?)",
        space.id,
        space.name,
        index,
      );
    for (const [index, card] of data.cards.entries())
      await sql.runAsync(
        "INSERT INTO cards (id, space_id, position, payload) VALUES (?, ?, ?, ?)",
        card.id,
        card.spaceId,
        index,
        JSON.stringify(card),
      );
    await sql.runAsync(
      "INSERT OR REPLACE INTO metadata (key, value) VALUES ('schema', '1')",
    );
  }
  async function initialize() {
    await db.execAsync(schema);
    if (await marker(db)) return;
    const raw = await legacy.getItem(key);
    const initial = raw === null ? empty() : parseData(raw);
    const prior = await legacy.getItem(key + ":recovery");
    // Bad old recovery must not prevent migration of a valid primary.
    let recovery: string | null = null;
    if (prior !== null) {
      try {
        recovery = JSON.stringify(parseData(prior));
      } catch {
        /* legacy bytes remain untouched */
      }
    }
    await db.withExclusiveTransactionAsync(async (tx) => {
      if (await marker(tx)) return;
      await replace(tx, initial);
      if (recovery !== null)
        await tx.runAsync(
          "INSERT OR REPLACE INTO metadata (key, value) VALUES ('recovery', ?)",
          recovery,
        );
    });
  }
  return {
    key,
    load: () =>
      serial(async () => {
        await initialize();
        return read(db);
      }),
    save: (next: Data) =>
      serial(async () => {
        const valid = parseData(JSON.stringify(next));
        await initialize();
        await db.withExclusiveTransactionAsync(async (tx) => {
          // Validate primary before touching the known-good recovery.
          const previous = await read(tx);
          await tx.runAsync(
            "INSERT OR REPLACE INTO metadata (key, value) VALUES ('recovery', ?)",
            JSON.stringify(previous),
          );
          const mediaTable=await tx.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' AND name='media_v2'");
          if(mediaTable){
            const rows=await tx.getAllAsync<{id:string;card_id:string;relative_path:string;mime:string;byte_count:number;sha256:string}>("SELECT id,card_id,relative_path,mime,byte_count,sha256 FROM media_v2 ORDER BY id");
            const manifest={version:2,media:rows.map(r=>({id:r.id,cardId:r.card_id,path:r.relative_path,mime:r.mime,bytes:r.byte_count,sha256:r.sha256}))};
            await tx.runAsync("INSERT OR REPLACE INTO metadata(key,value) VALUES('recovery_media_v2',?)",JSON.stringify(manifest));
          }
          await replace(tx, valid);
        });
      }),
    recover: () =>
      serial(async () => {
        await db.execAsync(schema);
        let restored: Data = empty();
        if (!(await marker(db))) {
          const raw = await legacy.getItem(key + ":recovery");
          if (raw === null)
            throw new Error("No previous saved copy is available.");
          restored = parseData(raw);
          await db.withExclusiveTransactionAsync((tx) => replace(tx, restored));
        } else {
          await db.withExclusiveTransactionAsync(async (tx) => {
            const row = await tx.getFirstAsync<{ value: string }>(
              "SELECT value FROM metadata WHERE key = 'recovery'",
            );
            if (!row) throw new Error("No previous saved copy is available.");
            restored = parseData(row.value);
            await replace(tx, restored);
          });
        }
        return restored;
      }),
  };
}

