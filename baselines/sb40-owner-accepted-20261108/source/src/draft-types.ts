import type { Context, Data } from "./model";
import type { NativeDraft } from "./sb20-native-adapter";
export interface AddDraft extends NativeDraft {
  version: 1;
  attempt: string;
  memoryId: string;
  spaceId: string;
  context: Context;
  location: string;
}
export interface DraftStore {
  load(): Promise<AddDraft | null>;
  checkpoint(draft: AddDraft): Promise<void>;
  discard(id: string, checkpoint: number): Promise<void>;
  save(attempt: string, memoryId: string): Promise<{ data: Data; id: string }>;
}


export class DraftAlreadySavedError extends Error {
  constructor() { super("This draft was already saved"); this.name = "DraftAlreadySavedError"; }
}
