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
