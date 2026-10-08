import type { Storage } from "./repository.ts";
export type AppearancePreference = "System" | "Light" | "Dark";
export type Preferences = { large: boolean; appearance: AppearancePreference };
export const defaultPreferences: Preferences = {
  large: false,
  appearance: "System",
};
export function preferenceStore(storage: Storage, environment: string) {
  if (!["development", "staging"].includes(environment))
    throw new Error("Unsupported environment");
  const key = "casitadex:" + environment + ":preferences";
  return {
    async load(): Promise<Preferences> {
      const raw = await storage.getItem(key);
      if (raw === null) return defaultPreferences;
      const value = JSON.parse(raw);
      if (
        typeof value.large !== "boolean" ||
        !["System", "Light", "Dark"].includes(value.appearance)
      )
        throw new Error("Invalid reading preferences");
      return { large: value.large, appearance: value.appearance };
    },
    save: (value: Preferences) => storage.setItem(key, JSON.stringify(value)),
  };
}
