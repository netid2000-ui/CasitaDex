import { engEnabled } from "./eng-runtime";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createRepository } from "./persistence";
import {
  preferenceStore,
  defaultPreferences,
  type Preferences,
  type AppearancePreference,
} from "./preferences";
import { empty, type Data } from "./model";
const environment =
  Constants.expoConfig?.extra?.appEnvironment || "development";
const repo = createRepository(environment);
const prefs = preferenceStore(AsyncStorage, environment);
type State = {
  drafts: typeof repo.drafts;
  saveDraft: (attempt: string, memoryId: string) => Promise<string | null>;
  data: Data;
  ready: boolean;
  error: string;
  busy: boolean;
  large: boolean;
  appearance: AppearancePreference;
  setAppearance: (v: AppearancePreference) => void;
  preferenceError: string;
  setLarge: (v: boolean) => void;
  save: (d: Data) => Promise<boolean>;
  reload: () => Promise<void>;
  recover: () => Promise<void>;
};
const Context = createContext<State | null>(null);
export function Provider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(empty),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [preferences, setPreferences] = useState(defaultPreferences),
    [preferenceError, setPreferenceError] = useState("");
  const currentPreferences = useRef(defaultPreferences);
  const preferenceQueue = useRef(Promise.resolve());
  function updatePreferences(patch: Partial<Preferences>) {
    const next = { ...currentPreferences.current, ...patch };
    currentPreferences.current = next;
    setPreferences(next);
    preferenceQueue.current = preferenceQueue.current
      .then(() => prefs.save(next))
      .then(() => setPreferenceError(""))
      .catch(() =>
        setPreferenceError(
          "This reading setting applies now but could not be saved. Select it again to retry.",
        ),
      );
  }
  const setLarge = (large: boolean) => updatePreferences({ large });
  const setAppearance = (appearance: AppearancePreference) =>
    updatePreferences({ appearance });
  const lock = useRef(false);
  async function reload() {
    setReady(false);
    try {
      setData(engEnabled ? empty() : await repo.load());
      setError("");
      setReady(true);
    } catch {
      setError(
        "We could not read your saved answers. Nothing has been overwritten. Retry or recover the previous save.",
      );
    }
  }
  useEffect(() => {
    let active = true;
    Promise.all([
      engEnabled ? Promise.resolve(empty()) : repo.load(),
      prefs.load().catch(() => {
        if (active)
          setPreferenceError(
            "Your reading settings could not be loaded. Choose them again to save.",
          );
        return defaultPreferences;
      }),
    ])
      .then(([loaded, reading]) => {
        if (active) {
          currentPreferences.current = reading;
          setPreferences(reading);
          setData(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (active)
          setError(
            "We could not read your saved answers. Nothing has been overwritten. Retry or recover the previous save.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  async function save(next: Data) {
    if (lock.current || !ready) return false;
    lock.current = true;
    setBusy(true);
    try {
      await repo.save(next);
      setData(next);
      setError("");
      return true;
    } catch {
      setError(
        "Your change could not be saved. Your previous answers are still shown. Please try again.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function saveDraft(attempt: string, memoryId: string) {
    if (lock.current || !ready || !repo.drafts) return null;
    lock.current = true;
    setBusy(true);
    try {
      const result = await repo.drafts.save(attempt, memoryId);
      setData(result.data);
      setError("");
      return result.id;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed. Your draft is preserved.");
      return null;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function recover() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      setData(await repo.recover());
      setError("");
      setReady(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Recovery failed. Your stored data has been preserved.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Context.Provider
      value={{
        drafts: repo.drafts,
        saveDraft,
        data,
        ready,
        error,
        busy,
        large: preferences.large,
        appearance: preferences.appearance,
        setAppearance,
        preferenceError,
        setLarge,
        save,
        reload,
        recover,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useData() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing provider");
  return value;
}
