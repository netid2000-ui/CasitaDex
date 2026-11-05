import type { EngBackup } from "./eng-runtime";
import type { EngSnapshot } from "./eng-types";

export type BackupReviewState = {
  request: object | null;
  incoming: EngBackup | null;
  restoreToken: string | null;
  reminderRestoreToken: string | null;
  conflict: "keep" | "incoming" | null;
  textReview: { snapshot: EngSnapshot; token: string } | null;
  confirmRecovery: boolean;
};
export function emptyBackupReview(): BackupReviewState {
  return { request: null, incoming: null, restoreToken: null, reminderRestoreToken: null,
    conflict: null, textReview: null, confirmRecovery: false };
}
export type BackupReviewAction =
  | { type: "reset" }
  | { type: "begin"; request: object }
  | { type: "selected"; request: object; incoming: EngBackup | null; restoreToken: string | null; reminderRestoreToken: string | null }
  | { type: "draft"; value: "keep" | "incoming" }
  | { type: "text"; request: object; value: BackupReviewState["textReview"] }
  | { type: "recovery" };

/** Only the current selection may enable replacement. Back, cancellation and new picks invalidate it. */
export function backupReviewReducer(state: BackupReviewState, action: BackupReviewAction): BackupReviewState {
  switch (action.type) {
    case "reset": return emptyBackupReview();
    case "begin": return { ...emptyBackupReview(), request: action.request };
    case "selected":
      if (state.request !== action.request) return state;
      if (!action.incoming) return emptyBackupReview();
      if (!action.restoreToken || (action.incoming.reminders && !action.reminderRestoreToken)) return emptyBackupReview();
      return { ...emptyBackupReview(), incoming: action.incoming, restoreToken: action.restoreToken,
        reminderRestoreToken: action.reminderRestoreToken };
    case "draft": return state.incoming ? { ...state, conflict: action.value } : state;
    case "text": return state.request === action.request ? { ...emptyBackupReview(), textReview: action.value } : state;
    case "recovery": return { ...emptyBackupReview(), confirmRecovery: true };
  }
}
