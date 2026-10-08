import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabaseAsync } from "expo-sqlite";
import { sqliteRepository, type Database } from "./sqlite-repository";
export function createRepository(environment: string) {
  if (!["development", "staging"].includes(environment))
    throw new Error("Unsupported environment");
  let pending: ReturnType<typeof open> | undefined;
  async function open() {
    const db = await openDatabaseAsync("casitadex-" + environment + "-v1.db");
    // This private connection is used only through the repository's serial queue.
    // Keeping the transaction on it also preserves its foreign_keys pragma.
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
    return sqliteRepository(database, AsyncStorage, environment);
  }
  function get() {
    pending ??= open().catch((error) => {
      pending = undefined;
      throw error;
    });
    return pending;
  }
  return {
    load: async () => (await get()).load(),
    save: async (
      data: Parameters<ReturnType<typeof sqliteRepository>["save"]>[0],
    ) => (await get()).save(data),
    recover: async () => (await get()).recover(),
  };
}
