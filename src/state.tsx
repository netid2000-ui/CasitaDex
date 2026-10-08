import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { repository } from "./repository";
import { empty, type Data } from "./model";
const repo = repository(
  AsyncStorage,
  Constants.expoConfig?.extra?.appEnvironment || "development",
);
type State = {
  data: Data;
  ready: boolean;
  error: string;
  busy: boolean;
  large: boolean;
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
    [large, setLarge] = useState(false);
  const lock = useRef(false);
  async function reload() {
    setReady(false);
    try {
      setData(await repo.load());
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
    repo
      .load()
      .then((loaded) => {
        if (active) {
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
        data,
        ready,
        error,
        busy,
        large,
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
