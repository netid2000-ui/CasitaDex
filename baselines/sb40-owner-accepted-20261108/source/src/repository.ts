import { empty, parseData, type Data } from "./model.ts";
export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
export function repository(storage: Storage, environment: string) {
  if (!["development", "staging"].includes(environment))
    throw new Error("Unsupported environment");
  const key = "casitadex:" + environment + ":v1";
  return {
    key,
    async load(): Promise<Data> {
      const raw = await storage.getItem(key);
      return raw === null ? empty() : parseData(raw);
    },
    async save(data: Data): Promise<void> {
      const raw = JSON.stringify(parseData(JSON.stringify(data)));
      const previous = await storage.getItem(key);
      if (previous !== null) {
        const checked = JSON.stringify(parseData(previous));
        await storage.setItem(key + ":recovery", checked);
      }
      await storage.setItem(key, raw);
    },
    async recover(): Promise<Data> {
      const raw = await storage.getItem(key + ":recovery");
      if (raw === null) throw new Error("No previous saved copy is available.");
      const d = parseData(raw);
      await storage.setItem(key, JSON.stringify(d));
      return d;
    },
  };
}
