import { contexts, parseData, type Data, type Card } from "./model.ts";
import type { Database, SQL } from "./sqlite-repository.ts";
import { safeId, saveNativeDraft, type NativeDraftPort } from "./sb20-native-adapter.ts";
import { DraftAlreadySavedError, type AddDraft, type DraftStore } from "./draft-types.ts";

const schema = `
CREATE TABLE IF NOT EXISTS add_draft_v1 (slot INTEGER PRIMARY KEY CHECK(slot=1), payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS add_attempt_v1 (token TEXT PRIMARY KEY NOT NULL, memory_id TEXT NOT NULL);
`;
export function validateAddDraft(value: unknown): AddDraft {
  if (!value || typeof value !== "object") throw Error("Invalid draft");
  const d = value as AddDraft;
  const allowed = new Set(["version", "id", "attempt", "memoryId", "checkpoint", "title", "answer", "spaceId", "context", "location"]);
  if (Object.keys(d).some(key => !allowed.has(key))) throw Error("Unsupported draft fields");
  if (d.version !== 1 || !Number.isSafeInteger(d.checkpoint) || d.checkpoint < 0 ||
      typeof d.title !== "string" || d.title.length > 200 ||
      typeof d.answer !== "string" || d.answer.length > 1000 ||
      typeof d.location !== "string" || d.location.length > 1000 ||
      !contexts.includes(d.context)) throw Error("Invalid draft fields");
  for (const id of [d.id, d.attempt, d.memoryId, d.spaceId]) {
    if (typeof id !== "string") throw Error("Invalid draft identity");
    safeId(id);
  }
  return { version: 1, id: d.id, attempt: d.attempt, memoryId: d.memoryId,
    checkpoint: d.checkpoint, title: d.title, answer: d.answer,
    spaceId: d.spaceId, context: d.context, location: d.location };
}
async function draft(sql: SQL): Promise<AddDraft | null> {
  const row = await sql.getFirstAsync<{ payload: string }>("SELECT payload FROM add_draft_v1 WHERE slot=1");
  return row ? validateAddDraft(JSON.parse(row.payload)) : null;
}
async function collection(sql: SQL): Promise<Data> {
  const spaces = await sql.getAllAsync<{ id: string; name: string }>("SELECT id,name FROM spaces ORDER BY position");
  const cards = await sql.getAllAsync<{ payload: string }>("SELECT payload FROM cards ORDER BY position");
  return parseData(JSON.stringify({ version: 1, spaces, cards: cards.map(c => JSON.parse(c.payload)), media: [] }));
}
/** Call through the persistence connection's shared serial queue, after v1 initialization.
 * ENG-D save orchestration, bound to the same real SQLite transaction as the card.
 * This bounded slice handles text drafts only; no staged-media acceptance is implied. */
export function sqliteDraftStore(db: Database): DraftStore {
  const prepare = () => db.execAsync(schema);
  const port: NativeDraftPort = {
    readDraft: () => draft(db),
    writeCheckpoint: async () => { throw Error("Use versioned checkpoint"); },
    readStaged: async () => [],
    recordStaged: async () => { throw Error("Draft media not enabled in this integration slice"); },
    async findAttempt(token) {
      const row = await db.getFirstAsync<{ memory_id: string }>("SELECT memory_id FROM add_attempt_v1 WHERE token=?", safeId(token));
      return row?.memory_id ?? null;
    },
    async commitSave({ token, memoryId, draft: expected, photos }) {
      if (photos.length) throw Error("Draft media not enabled");
      await db.withExclusiveTransactionAsync(async tx => {
        const replay = await tx.getFirstAsync<{ memory_id: string }>("SELECT memory_id FROM add_attempt_v1 WHERE token=?", token);
        if (replay) {
          if (replay.memory_id !== memoryId) throw Error("Save attempt conflict");
          return;
        }
        const current = await draft(tx);
        if (!current || current.id !== expected.id || current.checkpoint !== expected.checkpoint ||
            current.title !== expected.title || current.answer !== expected.answer ||
            current.attempt !== token || current.memoryId !== memoryId) throw Error("Draft changed; retry saving");
        const previous = await collection(tx);
        if (!previous.spaces.some(s => s.id === current.spaceId)) throw Error("Choose an available space before saving");
        const card: Card = {
          id: memoryId, spaceId: current.spaceId, title: current.title.trim(),
          answer: current.answer.trim(), location: current.location.trim(), notes: "",
          context: current.context, confidence: "Unknown", source: "", history: [],
        };
        const next = { ...previous, cards: [...previous.cards, card] };
        parseData(JSON.stringify(next));
        await tx.runAsync("INSERT OR REPLACE INTO metadata(key,value) VALUES('recovery',?)", JSON.stringify(previous));
        const mediaTable = await tx.getFirstAsync<{ name: string }>("SELECT name FROM sqlite_master WHERE type='table' AND name='media_v2'");
        if (mediaTable) {
          const rows = await tx.getAllAsync<{ id: string; card_id: string; relative_path: string; mime: string; byte_count: number; sha256: string }>("SELECT id,card_id,relative_path,mime,byte_count,sha256 FROM media_v2 ORDER BY id");
          const manifest = { version: 2, media: rows.map(r => ({ id: r.id, cardId: r.card_id, path: r.relative_path, mime: r.mime, bytes: r.byte_count, sha256: r.sha256 })) };
          await tx.runAsync("INSERT OR REPLACE INTO metadata(key,value) VALUES('recovery_media_v2',?)", JSON.stringify(manifest));
        }
        const position = await tx.getFirstAsync<{ n: number }>("SELECT COALESCE(MAX(position),-1)+1 AS n FROM cards");
        await tx.runAsync("INSERT INTO cards(id,space_id,position,payload) VALUES(?,?,?,?)", card.id, card.spaceId, position?.n ?? 0, JSON.stringify(card));
        await tx.runAsync("INSERT INTO add_attempt_v1(token,memory_id) VALUES(?,?)", token, memoryId);
        await tx.runAsync("DELETE FROM add_draft_v1 WHERE slot=1");
      });
    },
  };
  return {
    async load() { await prepare(); return draft(db); },
    async checkpoint(input) {
      const next = validateAddDraft(input);
      await prepare();
      await db.withExclusiveTransactionAsync(async tx => {
        const saved = await tx.getFirstAsync<{ memory_id: string }>("SELECT memory_id FROM add_attempt_v1 WHERE token=?", next.attempt);
        if (saved) throw new DraftAlreadySavedError();
        const current = await draft(tx);
        if (current) {
          if (current.id !== next.id || current.attempt !== next.attempt || current.memoryId !== next.memoryId)
            throw Error("Continue or discard your existing draft first");
          if (next.checkpoint < current.checkpoint) throw Error("Stale draft checkpoint");
          if (next.checkpoint === current.checkpoint) {
            if (JSON.stringify(next) !== JSON.stringify(current)) throw Error("Conflicting draft checkpoint");
            return;
          }
        }
        await tx.runAsync("INSERT OR REPLACE INTO add_draft_v1(slot,payload) VALUES(1,?)", JSON.stringify(next));
      });
    },
    async discard(id, checkpoint) {
      await prepare();
      await db.withExclusiveTransactionAsync(async tx => {
        const current = await draft(tx);
        if (!current) return;
        if (current.id !== id || current.checkpoint !== checkpoint) throw Error("Draft changed; review before discarding");
        await tx.runAsync("DELETE FROM add_draft_v1 WHERE slot=1");
      });
    },
    async save(attempt, memoryId) {
      safeId(attempt); safeId(memoryId); await prepare();
      const replay = await port.findAttempt(attempt);
      if (replay && replay !== memoryId) throw Error("Save attempt conflict");
      const id = await saveNativeDraft(port,
        { copyPrivate: async () => { throw Error("Draft media not enabled"); }, readPrivate: async () => { throw Error("Draft media not enabled"); } },
        { sha256: async () => { throw Error("Draft media not enabled"); } }, attempt, memoryId);
      const data = await collection(db);
      if (!data.cards.some(c => c.id === id)) throw Error("Previously saved memory is no longer in this collection");
      return { data, id };
    },
  };
}
