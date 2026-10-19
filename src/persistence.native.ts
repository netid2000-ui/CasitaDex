import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabaseAsync } from "expo-sqlite";
import { sqliteRepository, type Database } from "./sqlite-repository";
import { sqliteDraftStore } from "./draft-sqlite";
import type { DraftStore } from "./draft-types";
export function createRepository(environment: string) {
  if (!["development", "staging"].includes(environment))
    throw new Error("Unsupported environment");
  let pending: ReturnType<typeof open> | undefined;
  let queue: Promise<unknown> = Promise.resolve();
  async function open() {
    const db = await openDatabaseAsync("casitadex-" + environment + "-v1.db");
    const database: Database = {
      execAsync: db.execAsync.bind(db),
      runAsync: db.runAsync.bind(db),
      getFirstAsync: db.getFirstAsync.bind(db),
      getAllAsync: db.getAllAsync.bind(db),
      async withExclusiveTransactionAsync(task) {
        await db.execAsync("BEGIN IMMEDIATE");
        try {
          await task(db);
          await db.execAsync("COMMIT");
        } catch (error) {
          await db.execAsync("ROLLBACK");
          throw error;
        }
      },
    };
    const repository = sqliteRepository(database, AsyncStorage, environment);
    await repository.load();
    return { repository, drafts: sqliteDraftStore(database) };
  }
  function get() {
    pending ??= open().catch(error => { pending = undefined; throw error; });
    return pending;
  }
  function serial<T>(task: (stores: Awaited<ReturnType<typeof open>>) => Promise<T>): Promise<T> {
    const next = queue.then(async () => task(await get()));
    queue = next.catch(() => undefined);
    return next;
  }
  const drafts: DraftStore = {
    load: () => serial(s => s.drafts.load()),
    checkpoint: value => serial(s => s.drafts.checkpoint(value)),
    discard: (id, checkpoint) => serial(s => s.drafts.discard(id, checkpoint)),
    save: (attempt, memoryId) => serial(s => s.drafts.save(attempt, memoryId)),
  };
  return {
    drafts: environment === "development" ? drafts : undefined,
    load: () => serial(s => s.repository.load()),
    save: (data: Parameters<ReturnType<typeof sqliteRepository>["save"]>[0]) => serial(s => s.repository.save(data)),
    recover: () => serial(s => s.repository.recover()),
  };
}

