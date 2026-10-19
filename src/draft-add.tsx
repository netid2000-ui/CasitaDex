import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Image, View } from "react-native";
import { router } from "expo-router";
import { useData } from "./state";
import { Button, Copy, Field, Page, useTheme } from "./ui";
import { contexts } from "./model";
import { DraftAlreadySavedError, type AddDraft } from "./draft-types";
const uid = () => Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);

export function DraftAdd() {
  const { data, drafts, saveDraft, busy } = useData();
  const { s } = useTheme();
  const [form, setForm] = useState<AddDraft | null>(null);
  const [mode, setMode] = useState<"loading" | "resume" | "edit" | "error">("loading");
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const current = useRef<AddDraft | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(false);
  const done = useRef(false);
  const blocked = useRef(false);
  const write = useCallback(async (value: AddDraft) => {
    if (!drafts) throw Error("Draft storage is unavailable");
    if (alive.current) setStatus("Saving draft...");
    await drafts.checkpoint(value);
    if (alive.current && current.current?.checkpoint === value.checkpoint)
      setStatus("Draft saved on this device.");
  }, [drafts]);
  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const value = current.current;
    if (value && !done.current) await write(value);
  }, [write]);

  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    if (drafts) {
      void drafts.load().then(value => {
        if (cancelled) return;
        current.current = value;
        setForm(value);
        setMode(value ? "resume" : "edit");
        setStatus(value ? "An unfinished memory is saved on this device." : "");
      }).catch(() => {
        if (!cancelled) {
          setMode("error");
          setStatus("Your draft could not be read. Nothing has been overwritten. Leave this screen and retry.");
        }
      });
    }
    const listener = AppState.addEventListener("change", state => {
      if (state !== "active") void flush().catch(() => {
        if (alive.current) setStatus("Draft could not be saved. Keep the app open and try again.");
      });
    });
    return () => {
      cancelled = true;
      alive.current = false;
      listener.remove();
      void flush().catch(() => undefined);
    };
  }, [drafts, flush]);

  function change(patch: Partial<Pick<AddDraft, "title" | "answer" | "location" | "context" | "spaceId">>) {
    if (blocked.current || done.current || mode !== "edit") return;
    const initial: AddDraft = current.current ?? {
      version: 1, id: uid(), attempt: uid(), memoryId: uid(), checkpoint: 0,
      title: "", answer: "", location: "", context: "Buy", spaceId: data.spaces[0].id,
    };
    const next = { ...initial, ...patch, checkpoint: initial.checkpoint + 1 };
    current.current = next;
    setForm(next);
    setStatus("Draft has changes to save.");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      void write(next).catch(() => {
        if (alive.current) setStatus("Draft could not be saved. Your last saved draft is kept. Try again.");
      });
    }, 400);
  }
  async function submit() {
    const value = current.current;
    if (!value?.title.trim() || !value.answer.trim()) {
      setStatus("Add a name and an answer before saving.");
      return;
    }
    if (blocked.current) return;
    blocked.current = true;
    setWorking(true);
    try {
      try { await flush(); } catch (e) {
        if (!(e instanceof DraftAlreadySavedError)) throw e;
      }
      const id = await saveDraft(value.attempt, value.memoryId);
      if (!id) throw Error("Memory could not be saved. Your draft is kept. Try again.");
      done.current = true;
      router.replace({ pathname: "/card", params: { id } });
    } catch (e) {
      if (alive.current) setStatus(e instanceof Error ? e.message : "Save failed. Your draft is kept.");
    } finally {
      blocked.current = false;
      if (alive.current) setWorking(false);
    }
  }
  async function discard() {
    if (blocked.current || !drafts) return;
    blocked.current = true;
    setWorking(true);
    try {
      await flush();
      const value = current.current;
      done.current = true;
      if (value) await drafts.discard(value.id, value.checkpoint);
      current.current = null;
      setForm(null);
      setConfirmDiscard(false);
      setMode("edit");
      setStatus("Draft discarded. Your saved memories are unchanged.");
    } catch {
      setStatus("Draft could not be discarded. It has been kept.");
    } finally {
      done.current = false;
      blocked.current = false;
      if (alive.current) setWorking(false);
    }
  }
  async function leave() {
    if (blocked.current) return;
    blocked.current = true;
    setWorking(true);
    try { await flush(); router.replace("/"); }
    catch { setStatus("Draft could not be saved. Please try again before leaving."); }
    finally { blocked.current = false; if (alive.current) setWorking(false); }
  }
  const disabled = busy || working;
  return (
    <Page title={mode === "resume" ? "Continue your memory?" : "Add a Memory"}
      subtitle="Save a quick detail now, so you can find it later.">
      <Image source={require("../assets/house-trees-header.png")} resizeMode="contain"
        accessibilityLabel="House and trees" style={{ width: 120, height: 102, alignSelf: "flex-end" }} />
      {mode === "resume" ? <>
        <Copy kind="answer">{form?.title || "Unfinished memory"}</Copy>
        <Copy>Your unfinished memory is kept separately from saved answers.</Copy>
        <Button primary label="Continue draft" disabled={disabled}
          onPress={() => { setMode("edit"); setStatus("Continue editing your saved draft."); }} />
        <Button label="Discard draft" disabled={disabled} onPress={() => setConfirmDiscard(true)} />
      </> : null}
      {mode === "edit" ? <>
        <Field label="What do you want to remember?" value={form?.title ?? ""} onChangeText={title => change({ title })} />
        <Field label="The answer" value={form?.answer ?? ""} onChangeText={answer => change({ answer })} />
        <Field label="Where it is (optional)" value={form?.location ?? ""} onChangeText={location => change({ location })} />
        {data.spaces.length > 1 ? <>
          <Copy>Space</Copy>
          <View style={s.row}>{data.spaces.map(space =>
            <Button key={space.id} label={space.name}
              selected={(form?.spaceId ?? data.spaces[0].id) === space.id} disabled={disabled}
              onPress={() => change({ spaceId: space.id })} />)}</View>
        </> : null}
        <Copy>Category (optional)</Copy>
        <View style={s.row}>{contexts.map(context =>
          <Button key={context} label={context} selected={(form?.context ?? "Buy") === context}
            disabled={disabled} onPress={() => change({ context })} />)}</View>
        <Copy>Starts as Unknown. Confirm against a source when you are ready. Keep passwords, door codes and alarm codes out of CasitaDex.</Copy>
        <Button primary label={disabled ? "Saving..." : "Save memory"} disabled={disabled} onPress={() => void submit()} />
        {form ? <Button label="Discard draft" disabled={disabled} onPress={() => setConfirmDiscard(true)} /> : null}
      </> : null}
      {confirmDiscard ? <View style={s.panel}>
        <Copy>Discard this unfinished memory? Your saved memories will stay as they are.</Copy>
        <Button label="Keep draft" disabled={disabled} onPress={() => setConfirmDiscard(false)} />
        <Button label="Confirm discard draft" disabled={disabled} onPress={() => void discard()} />
      </View> : null}
      <Copy>Unfinished drafts stay on this device. Save this memory before making a portable backup.</Copy>
      <Copy accessibilityLiveRegion="polite">{mode === "loading" ? "Reading your draft..." : status}</Copy>
      <Button label="Keep draft and leave" disabled={disabled || mode === "loading"} onPress={() => void leave()} />
    </Page>
  );
}
