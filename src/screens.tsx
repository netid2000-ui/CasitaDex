import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Platform, Share, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Copy, Field, Page, useTheme } from "./ui";
import { useData } from "./state";
import { pickBackupFile, saveBackupFile } from "./backup-files";
import {
  listCardImages,
  pickAndAttachImage,
  removeCardImage,
} from "./media-attachment";
import Constants from "expo-constants";
import {
  saveMediaBackup,
  pickMediaBackup,
  restoreMediaBackup,
  recoverMediaPrevious,
} from "./media-transfer";
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
  const { s, colors } = useTheme();
  return (
    <View style={[s.panel, { gap: 9, paddingVertical: 20 }]}>
      {card.demo && (
        <Copy kind="small" style={{ color: colors.muted }}>
          EXAMPLE - Not your home
        </Copy>
      )}
      <Copy
        kind="small"
        style={{ color: colors.muted, fontWeight: "700", letterSpacing: 0.7 }}
      >
        {card.title.toUpperCase()}
      </Copy>
      <Copy kind="answer">{card.answer}</Copy>
      {!compact && !!card.location && <Copy>{card.location}</Copy>}
      <Copy kind="small" style={{ color: colors.muted }}>
        {card.confidence}
        {card.verifiedAt ? " - " + card.verifiedAt : ""}
      </Copy>
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
            What is one thing you wish you could remember about your home?
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
              <Copy>Maintenance due: {c.due}</Copy>
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
            Buy: "Buy - Replacement facts, ready for the aisle.",
            Fix: "Fix - Models, references and recorded history.",
            Find: "Find - Your saved locations. Verify on site.",
            Maintain:
              "Maintain - Due dates you recorded. No device notifications in this prototype.",
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
                Exactly what you will share
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
        Starts as Unknown. Confirm against a source when you are ready. Keep
        passwords, door codes and alarm codes out of CasitaDex.
      </Copy>
      {!!error && <Copy accessibilityRole="alert">{error}</Copy>}
      <Button
        label={busy ? "Saving..." : "Save answer"}
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
  const mediaEnvironment =
    Constants.expoConfig?.extra?.appEnvironment || "development";
  const [images, setImages] = useState<{ id: string; uri: string }[]>([]);
  const [source, setSource] = useState(""),
    [due, setDue] = useState(""),
    [message, setMessage] = useState(""),
    [confirm, setConfirm] = useState(false),
    [editing, setEditing] = useState(false),
    [newAnswer, setNewAnswer] = useState("");
  useEffect(() => {
    if (!card || Platform.OS !== "android") return;
    let active = true;
    void listCardImages(mediaEnvironment, card.id)
      .then((rows) => {
        if (active) setImages(rows);
      })
      .catch(() => {
        if (active) setMessage("Images could not be loaded");
      });
    return () => {
      active = false;
    };
  }, [card, mediaEnvironment]);
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
            {card.demo && <Copy>EXAMPLE - Not your home</Copy>}
            <Copy kind="answer" selectable>
              {card.answer}
            </Copy>
            <Copy>
              {card.confidence}
              {card.verifiedAt ? " - " + card.verifiedAt : ""}
            </Copy>
            <Copy>{card.location}</Copy>
            <Copy>{card.notes}</Copy>
            <Copy>Source: {card.source || "Not recorded"}</Copy>
          </View>
          {Platform.OS === "android" && (
            <View style={s.panel}>
              <Copy accessibilityRole="header" kind="answer">
                Attached images
              </Copy>
              {images.length === 0 && <Copy>No images attached.</Copy>}
              {images.map((image) => (
                <View key={image.id}>
                  <Image
                    source={{ uri: image.uri }}
                    accessibilityLabel="Attached image"
                    style={{ width: 220, height: 180 }}
                    resizeMode="contain"
                  />
                  <Button
                    label="Remove attached image"
                    disabled={busy}
                    onPress={() => {
                      if (!card) return;
                      Alert.alert(
                        "Remove this image?",
                        "The image will be detached from this card.",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Remove",
                            style: "destructive",
                            onPress: () => {
                              void removeCardImage(
                                mediaEnvironment,
                                card.id,
                                image.id,
                              )
                                .then(() =>
                                  listCardImages(mediaEnvironment, card.id),
                                )
                                .then(setImages)
                                .catch((e) =>
                                  setMessage(
                                    e instanceof Error
                                      ? e.message
                                      : "Image removal failed",
                                  ),
                                );
                            },
                          },
                        ],
                      );
                    }}
                  />
                </View>
              ))}
              <Button
                label="Attach an image"
                disabled={busy}
                onPress={() => {
                  if (!card) return;
                  void pickAndAttachImage(mediaEnvironment, card.id)
                    .then(() => listCardImages(mediaEnvironment, card.id))
                    .then(setImages)
                    .catch((e) =>
                      setMessage(
                        e instanceof Error ? e.message : "Image import failed",
                      ),
                    );
                }}
              />
            </View>
          )}{" "}
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
                {h.date} - {h.action}
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
    reload,
  } = useData();
  const fileOperation = useRef(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [previewSource, setPreviewSource] = useState("");
  const [mediaCandidate, setMediaCandidate] = useState<{
    raw: Uint8Array;
    cardCount: number;
    imageCount: number;
  } | null>(null);
  const [mediaSnapshot, setMediaSnapshot] = useState("");
  const [confirmMediaRecovery, setConfirmMediaRecovery] = useState(false);
  const mediaEnvironment =
    Constants.expoConfig?.extra?.appEnvironment || "development";
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
          date and history entry. Text-only backups exclude attached images. Use
          Save full backup (with images) on Android for images and text. Backups
          are never automatic: keep independent copies.
        </Copy>
        {Platform.OS === "android" && (
          <>
            <Button
              label="Save full backup (with images)"
              disabled={busy || fileBusy}
              onPress={() => {
                if (fileOperation.current) return;
                fileOperation.current = true;
                setFileBusy(true);
                void saveMediaBackup(mediaEnvironment, data)
                  .then(setMessage)
                  .catch((e) =>
                    setMessage(
                      e instanceof Error ? e.message : "Full backup failed",
                    ),
                  )
                  .finally(() => {
                    fileOperation.current = false;
                    setFileBusy(false);
                  });
              }}
            />
            <Button
              label="Choose full backup to check"
              disabled={busy || fileBusy}
              onPress={() => {
                if (fileOperation.current) return;
                fileOperation.current = true;
                setFileBusy(true);
                setMediaCandidate(null);
                void pickMediaBackup()
                  .then((result) => {
                    if (result) {
                      setMediaCandidate(result);
                      setMediaSnapshot(exportData(data));
                      setMessage(
                        "Full backup checked. Confirm replacement below.",
                      );
                    } else
                      setMessage(
                        "Full backup selection canceled; nothing changed.",
                      );
                  })
                  .catch((e) =>
                    setMessage(
                      e instanceof Error ? e.message : "Invalid media backup",
                    ),
                  )
                  .finally(() => {
                    fileOperation.current = false;
                    setFileBusy(false);
                  });
              }}
            />{" "}
            {mediaCandidate && (
              <View style={s.panel}>
                <Copy>
                  Replace {data.cards.length} current cards with{" "}
                  {mediaCandidate.cardCount} cards and{" "}
                  {mediaCandidate.imageCount} images? Previous saved version is
                  retained for recovery.
                </Copy>
                <Button
                  label="Cancel full restore"
                  onPress={() => setMediaCandidate(null)}
                />
                <Button
                  label="Confirm full restore"
                  disabled={busy || fileBusy}
                  onPress={() => {
                    if (fileOperation.current) return;
                    if (exportData(data) !== mediaSnapshot) {
                      setMediaCandidate(null);
                      setMessage("Answers changed; check the backup again.");
                      return;
                    }
                    fileOperation.current = true;
                    setFileBusy(true);
                    void restoreMediaBackup(
                      mediaEnvironment,
                      mediaCandidate.raw,
                    )
                      .then(() => reload())
                      .then(() => {
                        setMediaCandidate(null);
                        setMessage("Full backup restored and verified.");
                      })
                      .catch((e) =>
                        setMessage(
                          e instanceof Error
                            ? e.message
                            : "Full restore failed; current answers preserved",
                        ),
                      )
                      .finally(() => {
                        fileOperation.current = false;
                        setFileBusy(false);
                      });
                  }}
                />
              </View>
            )}
            <Button
              label="Recover previous full save"
              disabled={busy || fileBusy}
              onPress={() => setConfirmMediaRecovery(true)}
            />
            {confirmMediaRecovery && (
              <View style={s.panel}>
                <Copy>
                  Replace current answers and images with the previous full
                  saved version?
                </Copy>
                <Button
                  label="Cancel full recovery"
                  onPress={() => setConfirmMediaRecovery(false)}
                />
                <Button
                  label="Confirm full recovery"
                  disabled={busy || fileBusy}
                  onPress={() => {
                    if (fileOperation.current) return;
                    fileOperation.current = true;
                    setFileBusy(true);
                    void recoverMediaPrevious(mediaEnvironment)
                      .then(() => reload())
                      .then(() => {
                        setConfirmMediaRecovery(false);
                        setMessage("Previous full save recovered.");
                      })
                      .catch((e) =>
                        setMessage(
                          e instanceof Error
                            ? e.message
                            : "Full recovery failed",
                        ),
                      )
                      .finally(() => {
                        fileOperation.current = false;
                        setFileBusy(false);
                      });
                  }}
                />
              </View>
            )}{" "}
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
                  .catch((e) =>
                    setMessage(
                      e instanceof Error ? e.message : "Backup failed.",
                    ),
                  )
                  .finally(() => {
                    fileOperation.current = false;
                    setFileBusy(false);
                  });
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
                      setMessage(
                        "File selection canceled. Your answers were not changed.",
                      );
                      return;
                    }
                    setInput(raw);
                    setCandidate(parseData(raw));
                    setPreviewSource(exportData(data));
                    setMessage(
                      "Backup checked. Review the counts before replacing your collection.",
                    );
                  })
                  .catch((e) => {
                    setCandidate(null);
                    setPreviewSource("");
                    setMessage(
                      e instanceof Error ? e.message : "Invalid backup file.",
                    );
                  })
                  .finally(() => {
                    fileOperation.current = false;
                    setFileBusy(false);
                  });
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
            <Button
              label="Cancel restore"
              onPress={() => {
                setCandidate(null);
                setPreviewSource("");
              }}
            />
            <Button
              label="Confirm replace from backup"
              disabled={busy || fileBusy}
              onPress={() => {
                if (fileOperation.current) return;
                if (exportData(data) !== previewSource) {
                  setCandidate(null);
                  setPreviewSource("");
                  setMessage(
                    "Answers changed since the backup check. Recheck before restoring.",
                  );
                  return;
                }
                fileOperation.current = true;
                setFileBusy(true);
                void save(candidate)
                  .then((ok) => {
                    if (ok) {
                      setCandidate(null);
                      setPreviewSource("");
                      setInput("");
                      setMessage("Backup restored.");
                    } else {
                      setMessage(
                        "Restore was not completed. Current answers were not replaced.",
                      );
                    }
                  })
                  .catch((e) => {
                    setMessage(
                      e instanceof Error ? e.message : "Restore failed.",
                    );
                  })
                  .finally(() => {
                    fileOperation.current = false;
                    setFileBusy(false);
                  });
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
          encrypted credential vault. Image attachments are Android-only in this
          prototype. Device notifications and purchases are unavailable.
        </Copy>
        <Copy>
          Support: include the screen and what went wrong when reporting
          feedback. Do not include private home details.
        </Copy>
        <Copy kind="small">
          ART + FUNCTION + EXPERIENCE - WITHOUT GIMMICKS.
        </Copy>
      </View>
    </Page>
  );
}

/**
 * SB-19 consumer UI: Home / Find. Kept separate from the legacy Today/Answers
 * components so Share and maintenance flows remain intact during migration.
 * All data is read from the same offline repository; no schema or cloud changes.
 */
export function Home() {
  const { data, save, busy } = useData();
  const { s, colors } = useTheme();
  const [quick, setQuick] = useState("");
  const recent = [...data.cards].reverse().slice(0, 3);
  const needsCheck = data.cards.filter(
    (c) => c.confidence === "Needs checking" || (!!c.due && c.due <= today()),
  );
  return (
    <Page
      title="A little less to remember."
      subtitle="Find the details you need, right when you need them."
    >
      <View style={[s.panel, { padding: 13, gap: 9 }]}>
        <Field
          label="Search your memories"
          value={quick}
          onChangeText={setQuick}
        />
        <Button
          label="Find an answer"
          onPress={() =>
            router.push({ pathname: "/answers", params: { q: quick } })
          }
        />
      </View>
      <View
        style={[
          s.panel,
          {
            backgroundColor: colors.accent,
            borderColor: colors.accent,
            paddingVertical: 24,
          },
        ]}
      >
        <Copy kind="small" style={{ fontWeight: "700", letterSpacing: 1 }}>
          SOMETHING TO REMEMBER?
        </Copy>
        <Copy kind="answer">Save it while it is fresh.</Copy>
        <Copy>Keep a quick household fact now, and find it later.</Copy>
        <Button
          label={data.cards.length ? "Save a memory" : "Save your first answer"}
          onPress={() => router.push("/add")}
        />
      </View>
      {data.cards.length === 0 ? (
        <View style={s.panel}>
          <Copy>
            One useful answer is enough to start. No inventory checklist or
            account is required.
          </Copy>
          <Button
            label="Explore example home"
            disabled={busy}
            onPress={() => void save(examples())}
          />
        </View>
      ) : (
        <>
          <Copy kind="answer" accessibilityRole="header">
            Recently remembered
          </Copy>
          {recent.map((c) => (
            <Tile key={c.id} card={c} />
          ))}
          {needsCheck.length > 0 && (
            <>
              <Copy accessibilityRole="header">Needs checking</Copy>
              {needsCheck.slice(0, 2).map((c) => (
                <Tile key={"needs-" + c.id} card={c} />
              ))}
            </>
          )}
          <Button
            label="See all answers"
            onPress={() => router.push("/answers")}
          />
        </>
      )}
      <Copy kind="small" style={{ color: colors.muted }}>
        Saved on this device. No account or automatic cloud backup.
      </Copy>
    </Page>
  );
}
export function FindHome() {
  const params = useLocalSearchParams<{ mode?: string; q?: string }>();
  const { data } = useData();
  const { s, colors } = useTheme();
  const [query, setQuery] = useState(params.q || "");
  const [mode, setMode] = useState("All");
  const [spaceId, setSpaceId] = useState<string | null>(null);
  const [browse, setBrowse] = useState(false);
  const [refine, setRefine] = useState(false);

  // Preserve the established privacy-reviewed selective share workflow.
  if (params.mode === "Share") return <Answers />;
  const cards = data.cards.filter(
    (c) =>
      matches(c, query, mode, today()) && (!spaceId || c.spaceId === spaceId),
  );
  return (
    <Page
      title="What are you looking for?"
      subtitle="Search a fact, a place, or something you want to remember."
    >
      <Field label="Search answers" value={query} onChangeText={setQuery} />
      <View style={s.row}>
        <Button
          label="All"
          selected={mode === "All" && !spaceId}
          onPress={() => {
            setMode("All");
            setSpaceId(null);
          }}
        />
        <Button
          label="Browse spaces"
          selected={browse}
          onPress={() => setBrowse(!browse)}
        />
        <Button
          label="Refine results"
          selected={refine}
          onPress={() => setRefine(!refine)}
        />
        <Button
          label="Share selected"
          onPress={() =>
            router.push({ pathname: "/answers", params: { mode: "Share" } })
          }
        />
      </View>
      {refine && (
        <View style={s.row}>
          {contexts.map((choice) => (
            <Button
              key={choice}
              label={choice}
              selected={mode === choice}
              onPress={() => {
                setMode(choice);
                setSpaceId(null);
              }}
            />
          ))}
        </View>
      )}
      {browse && (
        <View style={s.panel}>
          <Copy accessibilityRole="header">Places & spaces</Copy>
          <Copy>
            Browse if it helps. You can save an answer without organizing rooms
            first.
          </Copy>
          {data.spaces.map((space) => (
            <Button
              key={space.id}
              label={space.name}
              selected={spaceId === space.id}
              onPress={() => {
                setSpaceId(space.id);
                setMode("All");
                setBrowse(false);
              }}
            />
          ))}
        </View>
      )}
      <Copy kind="small" style={{ color: colors.muted }}>
        {cards.length} saved {cards.length === 1 ? "answer" : "answers"}
      </Copy>
      {cards.length ? (
        cards.map((c) => <Tile key={c.id} card={c} compact={mode === "Buy"} />)
      ) : (
        <View style={s.panel}>
          <Copy>
            No matching answers. Try another phrase or save what you want to
            remember.
          </Copy>
          <Button label="Save a memory" onPress={() => router.push("/add")} />
        </View>
      )}
      {spaceId && (
        <Button label="Show every space" onPress={() => setSpaceId(null)} />
      )}
      {mode !== "All" && (
        <Button label="Clear filters" onPress={() => setMode("All")} />
      )}
      <Copy kind="small" style={{ color: colors.muted }}>
        All results come from your device, including when offline.
      </Copy>
    </Page>
  );
}
