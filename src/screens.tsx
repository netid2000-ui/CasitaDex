import React, { useRef, useState } from "react";
import { Platform, Share, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Copy, Field, Page, useTheme } from "./ui";
import { useData } from "./state";
import { pickBackupFile, saveBackupFile } from "./backup-files";
import {
  confidences,
  contexts,
  examples,
  exportData,
  matches,
  parseData,
  snapshot,
  type Card,
  type Confidence,
  type Context,
  type Data,
} from "./model";
const today = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};
const uid = () =>
  Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
function Tile({ card, compact = false }: { card: Card; compact?: boolean }) {
  const { s } = useTheme();
  return (
    <View style={s.panel}>
      {card.demo && <Copy kind="small">EXAMPLE · Not your home</Copy>}
      <Copy kind="small">{card.title.toUpperCase()}</Copy>
      <Copy kind="answer">{card.answer}</Copy>
      <Copy>
        {card.confidence}
        {card.verifiedAt ? " · " + card.verifiedAt : ""}
      </Copy>
      {!compact && <Copy>{card.location}</Copy>}
      <Button
        label={"Open " + card.title}
        onPress={() =>
          router.push({ pathname: "/card", params: { id: card.id } })
        }
      />
    </View>
  );
}
export function Today() {
  const { s } = useTheme();
  const { data, save, busy } = useData();
  const due = data.cards.filter((c) => c.due && c.due <= today()),
    check = data.cards.filter((c) => c.confidence === "Needs checking");
  return (
    <Page
      title="A little less to remember."
      subtitle="Remember your home. Find it in seconds."
    >
      {data.cards.length === 0 ? (
        <View style={s.panel}>
          <Copy accessibilityRole="header" kind="answer">
            What’s one thing you wish you could remember about your home?
          </Copy>
          <Copy>
            A filter size. A paint color. Where something lives. Start with one
            useful answer.
          </Copy>
          <Button
            label="Save your first answer"
            onPress={() => router.push("/add")}
          />
          <Button
            label="Explore example home"
            disabled={busy}
            onPress={() => void save(examples())}
          />
        </View>
      ) : (
        <>
          <View style={s.row}>
            <Button
              label="Find an answer"
              onPress={() => router.push("/answers")}
            />
            <Button label="Add an answer" onPress={() => router.push("/add")} />
          </View>
          <Copy accessibilityRole="header" kind="answer">
            Needs attention
          </Copy>
          {due.length === 0 && check.length === 0 ? (
            <Copy>Nothing needs your attention right now.</Copy>
          ) : null}
          {due.map((c) => (
            <View key={"due" + c.id} style={s.gap}>
              <Copy>Maintenance due · {c.due}</Copy>
              <Tile card={c} />
            </View>
          ))}
          {check
            .filter((c) => !due.includes(c))
            .map((c) => (
              <Tile key={c.id} card={c} />
            ))}
        </>
      )}
      <Copy kind="small">
        Saved on this device. No account. No automatic cloud backup.
      </Copy>
    </Page>
  );
}
export function Answers() {
  const { s } = useTheme();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { data } = useData();
  const [query, setQuery] = useState(""),
    [mode, setMode] = useState(params.mode === "Share" ? "Share" : "All"),
    [ids, setIds] = useState<string[]>([]),
    [details, setDetails] = useState(false),
    [preview, setPreview] = useState(false),
    [message, setMessage] = useState("");
  const cards = data.cards.filter((c) => matches(c, query, mode, today()));
  const text = snapshot(data.cards, ids, details);
  async function share() {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(text);
        setMessage("Snapshot copied. Paste it only where you choose.");
      } else {
        await Share.share({ message: text });
        setMessage("Share sheet closed.");
      }
    } catch {
      setMessage(
        "Sharing was not completed. You can select and copy the preview text.",
      );
    }
  }
  return (
    <Page title="The answer, right here." subtitle="What are you trying to do?">
      <Field label="Search answers" value={query} onChangeText={setQuery} />
      <View style={s.row}>
        {["All", ...contexts, "Share"].map((m) => (
          <Button
            key={m}
            label={m}
            selected={mode === m}
            onPress={() => {
              setMode(m);
              setPreview(false);
              setMessage("");
            }}
          />
        ))}
      </View>
      <Copy>
        {(
          {
            Buy: "Store Mode · Replacement facts, ready for the aisle.",
            Fix: "Fix Mode · Models, references and recorded history.",
            Find: "Find · Your saved locations. Reference only; verify on site.",
            Maintain:
              "Maintain · Due dates you recorded. No device notifications in this prototype.",
            Share: "Select only the cards you want to disclose.",
          } as Record<string, string>
        )[mode] || "Your useful facts, together."}
      </Copy>
      {cards.length === 0 && (
        <View style={s.panel}>
          <Copy>No matching answers.</Copy>
          <Button label="Add an answer" onPress={() => router.push("/add")} />
        </View>
      )}
      {cards.map((c) =>
        mode === "Share" ? (
          <View key={c.id} style={s.panel}>
            <Copy kind="answer">{c.title}</Copy>
            <Copy>{c.answer}</Copy>
            <Button
              label={(ids.includes(c.id) ? "Selected: " : "Select: ") + c.title}
              selected={ids.includes(c.id)}
              onPress={() => {
                setIds(
                  ids.includes(c.id)
                    ? ids.filter((id) => id !== c.id)
                    : [...ids, c.id],
                );
                setPreview(false);
              }}
            />
          </View>
        ) : (
          <Tile key={c.id} card={c} compact={mode === "Buy"} />
        ),
      )}
      {mode === "Share" && (
        <View style={s.panel}>
          <Button
            label={
              details
                ? "Include location, notes and history: On"
                : "Include location, notes and history: Off"
            }
            selected={details}
            onPress={() => {
              setDetails(!details);
              setPreview(false);
            }}
          />
          <Copy>
            Title, answer and confidence are included. Other fields are excluded
            unless you enable them. No files or hidden data are included.
          </Copy>
          <Button
            label={"Preview " + ids.length + " selected cards"}
            disabled={!ids.length}
            onPress={() => setPreview(true)}
          />
          {preview && (
            <>
              <Copy accessibilityRole="header" kind="answer">
                Exactly what you’ll share
              </Copy>
              <Copy selectable>{text}</Copy>
              <Button
                label={
                  Platform.OS === "web"
                    ? "Copy this snapshot"
                    : "Open device share sheet"
                }
                onPress={() => void share()}
              />
            </>
          )}
          <Copy accessibilityLiveRegion="polite">{message}</Copy>
        </View>
      )}
    </Page>
  );
}
export function Add() {
  const { s } = useTheme();
  const { data, save, busy } = useData();
  const [title, setTitle] = useState(""),
    [answer, setAnswer] = useState(""),
    [location, setLocation] = useState(""),
    [context, setContext] = useState<Context>("Buy"),
    [error, setError] = useState("");
  async function submit() {
    if (!title.trim() || !answer.trim()) {
      setError("Add a name and an answer before saving.");
      return;
    }
    if (title.trim().length > 200) {
      setError("Please keep the name under 200 characters.");
      return;
    }
    const c: Card = {
      id: uid(),
      spaceId: data.spaces[0].id,
      title: title.trim(),
      answer: answer.trim(),
      location: location.trim(),
      notes: "",
      context,
      confidence: "Unknown",
      source: "",
      history: [],
    };
    if (await save({ ...data, cards: [...data.cards, c] })) {
      setTitle("");
      setAnswer("");
      setLocation("");
      setError("");
      router.replace({ pathname: "/card", params: { id: c.id } });
    }
  }
  return (
    <Page
      title="One useful answer."
      subtitle="Add more whenever something is worth remembering."
    >
      <Field
        label="What do you want to remember?"
        value={title}
        onChangeText={setTitle}
      />
      <Field label="The answer" value={answer} onChangeText={setAnswer} />
      <Field
        label="Where it is (optional)"
        value={location}
        onChangeText={setLocation}
      />
      <Copy>When will this help?</Copy>
      <View style={s.row}>
        {contexts.map((c) => (
          <Button
            key={c}
            label={c}
            selected={context === c}
            onPress={() => setContext(c)}
          />
        ))}
      </View>
      <Copy>
        Starts as Unknown. Confirm against a source when you’re ready. Keep
        passwords, door codes and alarm codes out of CasitaDex.
      </Copy>
      {!!error && <Copy accessibilityRole="alert">{error}</Copy>}
      <Button
        label={busy ? "Saving…" : "Save answer"}
        disabled={busy}
        onPress={() => void submit()}
      />
    </Page>
  );
}
export function Detail() {
  const { s } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, save, busy } = useData();
  const card = data.cards.find((c) => c.id === id);
  const [source, setSource] = useState(""),
    [due, setDue] = useState(""),
    [message, setMessage] = useState(""),
    [confirm, setConfirm] = useState(false),
    [editing, setEditing] = useState(false),
    [newAnswer, setNewAnswer] = useState("");
  async function update(patch: Partial<Card>) {
    if (!card) return false;
    return save({
      ...data,
      cards: data.cards.map((c) => (c.id === card.id ? { ...c, ...patch } : c)),
    });
  }
  async function verify(confidence: Confidence) {
    if (confidence === "Verified" && !source.trim()) {
      setMessage("Name the source you checked, such as the equipment label.");
      return;
    }
    if (
      await update({
        confidence,
        source: source.trim() || card?.source || "",
        verifiedAt: confidence === "Verified" ? today() : undefined,
      })
    ) {
      setMessage("Confidence updated.");
    }
  }
  async function reminder() {
    try {
      if (!card) return;
      const next = {
        ...data,
        cards: data.cards.map((c) =>
          c.id === id ? { ...c, due: due || undefined } : c,
        ),
      };
      parseData(JSON.stringify(next));
      if (await save(next))
        setMessage(
          due
            ? "Due date saved. Visible in Today when due; device notifications are not enabled."
            : "Due date removed.",
        );
    } catch {
      setMessage("Use a real date in YYYY-MM-DD format.");
    }
  }
  return (
    <Page title={card?.title || "Answer not found"}>
      {card ? (
        <>
          <View style={s.panel}>
            {card.demo && <Copy>EXAMPLE · Not your home</Copy>}
            <Copy kind="answer" selectable>
              {card.answer}
            </Copy>
            <Copy>
              {card.confidence}
              {card.verifiedAt ? " · " + card.verifiedAt : ""}
            </Copy>
            <Copy>{card.location}</Copy>
            <Copy>{card.notes}</Copy>
            <Copy>Source: {card.source || "Not recorded"}</Copy>
          </View>
          <Button
            label="Edit answer"
            disabled={busy}
            onPress={() => {
              setNewAnswer(card.answer);
              setEditing(true);
            }}
          />
          {editing && (
            <View style={s.panel}>
              <Field
                label="Updated answer"
                value={newAnswer}
                onChangeText={setNewAnswer}
              />
              <Copy>
                Changing the answer resets confidence to Needs checking.
              </Copy>
              <Button label="Cancel edit" onPress={() => setEditing(false)} />
              <Button
                label="Save edited answer"
                disabled={busy || !newAnswer.trim()}
                onPress={() =>
                  void update({
                    answer: newAnswer.trim(),
                    confidence: "Needs checking",
                    verifiedAt: undefined,
                  }).then((ok) => {
                    if (ok) setEditing(false);
                  })
                }
              />
            </View>
          )}
          <Copy accessibilityRole="header" kind="answer">
            Check the facts
          </Copy>
          <Copy>Opening an answer never changes its verification.</Copy>
          <Field
            label="Source you checked"
            value={source}
            onChangeText={setSource}
          />
          <View style={s.row}>
            {confidences.map((c) => (
              <Button
                key={c}
                label={"Mark " + c}
                disabled={busy}
                onPress={() => void verify(c)}
              />
            ))}
          </View>
          <Copy accessibilityRole="header" kind="answer">
            Maintenance
          </Copy>
          <Copy>Current due date: {card.due || "None"}</Copy>
          <Field
            label="New due date (YYYY-MM-DD, blank to remove)"
            value={due}
            onChangeText={setDue}
          />
          <Button
            label="Save due date"
            disabled={busy}
            onPress={() => void reminder()}
          />
          <Button
            label="Record maintenance done today"
            disabled={busy}
            onPress={() =>
              void update({
                due: undefined,
                history: [
                  ...card.history,
                  { id: uid(), date: today(), action: "Maintenance completed" },
                ],
              }).then(
                (ok) =>
                  ok && setMessage("Recorded. Set a new due date when needed."),
              )
            }
          />
          <Copy accessibilityRole="header" kind="answer">
            History
          </Copy>
          {card.history.length ? (
            card.history.map((h) => (
              <Copy key={h.id}>
                {h.date} · {h.action}
              </Copy>
            ))
          ) : (
            <Copy>No history recorded.</Copy>
          )}
          <Button
            label="Choose cards to share"
            onPress={() =>
              router.push({ pathname: "/answers", params: { mode: "Share" } })
            }
          />
          <Button
            label="Delete this answer"
            disabled={busy}
            onPress={() => setConfirm(true)}
          />
          {confirm && (
            <View style={s.panel}>
              <Copy>
                Delete this answer and its history from the current collection?
              </Copy>
              <Button label="Keep answer" onPress={() => setConfirm(false)} />
              <Button
                label="Confirm delete"
                disabled={busy}
                onPress={() =>
                  void save({
                    ...data,
                    cards: data.cards.filter((c) => c.id !== id),
                  }).then((ok) => ok && router.replace("/answers"))
                }
              />
            </View>
          )}
          <Copy accessibilityLiveRegion="polite">{message}</Copy>
        </>
      ) : (
        <Button
          label="Back to Answers"
          onPress={() => router.replace("/answers")}
        />
      )}
    </Page>
  );
}
export function More() {
  const { s } = useTheme();
  const {
    data,
    large,
    setLarge,
    appearance,
    setAppearance,
    preferenceError,
    save,
    busy,
    recover,
  } = useData();
  const fileOperation = useRef(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [previewSource, setPreviewSource] = useState("");
  const [output, setOutput] = useState(""),
    [input, setInput] = useState(""),
    [candidate, setCandidate] = useState<Data | null>(null),
    [message, setMessage] = useState(""),
    [recoveryConfirm, setRecoveryConfirm] = useState(false);
  function validate() {
    try {
      const d = parseData(input);
      setCandidate(d);
      setPreviewSource(exportData(data));
      setMessage(
        "Backup checked. Review the counts before replacing your collection.",
      );
    } catch (e) {
      setCandidate(null);
      setPreviewSource("");
      setMessage(e instanceof Error ? e.message : "Invalid backup.");
    }
  }
  return (
    <Page title="Yours to keep." subtitle="Your answers stay on this device.">
      <View style={s.panel}>
        <Copy accessibilityRole="header" kind="answer">
          Reading comfort
        </Copy>
        <Button
          label={large ? "Extra-large text: On" : "Extra-large text: Off"}
          selected={large}
          onPress={() => setLarge(!large)}
        />
        <Copy>Appearance</Copy>
        <View style={s.row}>
          {(["System", "Light", "Dark"] as const).map((value) => (
            <Button
              key={value}
              label={value}
              selected={appearance === value}
              onPress={() => setAppearance(value)}
            />
          ))}
        </View>
        {!!preferenceError && (
          <Copy accessibilityRole="alert">{preferenceError}</Copy>
        )}
        <Copy>
          System text scaling remains enabled. No information depends on color,
          motion or sound.
        </Copy>
      </View>
      <View style={s.panel}>
        <Copy accessibilityRole="header" kind="answer">
          Backup & recovery
        </Copy>
        <Copy>
          A backup includes every space, card, location, note, confidence, due
          date and history entry. This prototype has no photos or files. Backups
          are readable text: keep them somewhere you trust. Nothing is backed up
          automatically.
        </Copy>
        {Platform.OS === "android" && (
          <>
            <Button
              label="Save backup file"
              disabled={busy || fileBusy}
              onPress={() => {
                if (fileOperation.current) return;
                fileOperation.current = true;
                setFileBusy(true);
                setMessage("Choose a folder for your backup.");
                void saveBackupFile(data)
                  .then(setMessage)
                  .catch((e) => setMessage(e instanceof Error ? e.message : "Backup failed."))
                  .finally(() => { fileOperation.current = false; setFileBusy(false); });
              }}
            />
            <Button
              label="Choose backup file to restore"
              disabled={busy || fileBusy}
              onPress={() => {
                if (fileOperation.current) return;
                fileOperation.current = true;
                setFileBusy(true);
                setCandidate(null);
                setPreviewSource("");
                setMessage("Choose a CasitaDex backup file to check.");
                void pickBackupFile()
                  .then((raw) => {
                    if (raw === null) {
                      setMessage("File selection canceled. Your answers were not changed.");
                      return;
                    }
                    setInput(raw);
                    setCandidate(parseData(raw));
                    setPreviewSource(exportData(data));
                    setMessage("Backup checked. Review the counts before replacing your collection.");
                  })
                  .catch((e) => {
                    setCandidate(null);
                    setPreviewSource("");
                    setMessage(e instanceof Error ? e.message : "Invalid backup file.");
                  })
                  .finally(() => { fileOperation.current = false; setFileBusy(false); });
              }}
            />
          </>
        )}
        <Button
          label="Prepare text backup"
          onPress={() => setOutput(exportData(data))}
        />
        {!!output && (
          <>
            <Copy>Copy and save all of this text to a file you control.</Copy>
            <Field
              label="Complete backup text"
              value={output}
              onChangeText={setOutput}
              multiline
            />
          </>
        )}
        <Button
          label="Recover the previous save"
          disabled={busy}
          onPress={() => setRecoveryConfirm(true)}
        />
        {recoveryConfirm && (
          <>
            <Copy>
              Replace this collection with its previous saved version? Any
              changes since that save will be removed.
            </Copy>
            <Button
              label="Cancel recovery"
              onPress={() => setRecoveryConfirm(false)}
            />
            <Button
              label="Confirm recovery"
              disabled={busy}
              onPress={() =>
                void recover().then(() => setRecoveryConfirm(false))
              }
            />
          </>
        )}
        <Field
          label="Paste a CasitaDex backup to restore"
          value={input}
          onChangeText={(v) => {
            setInput(v);
            setCandidate(null);
            setPreviewSource("");
          }}
          multiline
        />
        <Button label="Check backup" onPress={validate} />
        {candidate && (
          <>
            <Copy>
              Replace {data.cards.length} current cards with{" "}
              {candidate.cards.length} cards in {candidate.spaces.length}{" "}
              spaces? A previous-save recovery copy is retained on this device.
            </Copy>
            <Button label="Cancel restore" onPress={() => { setCandidate(null); setPreviewSource(""); }} />
            <Button
              label="Confirm replace from backup"
              disabled={busy || fileBusy}
              onPress={() => {
                if (fileOperation.current) return;
                if (exportData(data) !== previewSource) {
                  setCandidate(null);
                  setPreviewSource("");
                  setMessage("Answers changed since the backup check. Recheck before restoring.");
                  return;
                }
                fileOperation.current = true;
                setFileBusy(true);
                void save(candidate).then((ok) => {
                  if (ok) {
                    setCandidate(null);
                    setPreviewSource("");
                    setInput("");
                    setMessage("Backup restored.");
                  } else {
                    setMessage("Restore was not completed. Current answers were not replaced.");
                  }
                }).catch((e) => {
                  setMessage(e instanceof Error ? e.message : "Restore failed.");
                }).finally(() => { fileOperation.current = false; setFileBusy(false); });
              }}
            />
          </>
        )}
        <Copy accessibilityLiveRegion="polite">{message}</Copy>
      </View>
      <View style={s.panel}>
        <Copy accessibilityRole="header" kind="answer">
          Prototype notes
        </Copy>
        <Copy>
          No account, ads, analytics or cloud service. Local storage is not an
          encrypted credential vault. Media attachments, device notifications
          and purchases are not available in this prototype.
        </Copy>
        <Copy>
          Support: include the screen and what went wrong when reporting
          feedback. Do not include private home details.
        </Copy>
        <Copy kind="small">
          ART + FUNCTION + EXPERIENCE — WITHOUT GIMMICKS.
        </Copy>
      </View>
    </Page>
  );
}
