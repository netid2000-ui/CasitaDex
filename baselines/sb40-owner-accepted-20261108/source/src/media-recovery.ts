import type { MediaOperation } from "./media-journal";
import type { MediaEntry } from "./media-manifest";
/** Read-only recovery verdict; never delete/rename file or modify a database. */
export type RecoveryVerdict = "verify-promoted" | "inspect-pending" | "metadata-mismatch" | "journal-complete";
export function evaluateMediaRecovery(
  journal: MediaOperation[], committed: MediaEntry[],
): {id:string;path:string;verdict:RecoveryVerdict}[] {
  const rows = new Map(committed.map(m => [m.id, m]));
  return journal.map(op => {
    const e=op.entry;
    const row=rows.get(e.id);
    const match = !!row && row.path===e.path && row.cardId===e.cardId && row.sha256===e.sha256 && row.bytes===e.bytes && row.mime===e.mime;
    const verdict:RecoveryVerdict = row ? (match && op.phase==="committed" ? "journal-complete" : "metadata-mismatch") : op.phase==="pending" ? "inspect-pending" : "verify-promoted";
    return {id:e.id,path:e.path,verdict};
  });
}