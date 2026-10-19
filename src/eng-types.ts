import type { DataV2 } from "./sb20-contract.ts";
import type { MediaEntry } from "./media-manifest.ts";
export interface EngDraft {
  id: string; attempt: string; memoryId: string; checkpoint: number;
  title: string; answer: string; location: string; spaceId: string | null;
  legacyContext: import("./model.ts").Context | null; categoryIds: string[]; photos: MediaEntry[];
  notes?:string; source?:string; due?:string;
}
export interface EngSnapshot {
  version: 3; revision: number; data: DataV2; draft: EngDraft | null;
  attempts: Record<string, string>;
}
export interface EngFiles {
  read(path: string): Promise<Uint8Array>;
  put(entry: MediaEntry, bytes: Uint8Array): Promise<void>;
  hash(bytes: Uint8Array): Promise<string>;
  capacity(required: number): Promise<void>;
}
export type DraftConflict = "keep" | "incoming" | "cancel";
