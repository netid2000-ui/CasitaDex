import type { EngSnapshot } from "./eng-types";
import type { ShareSelection } from "./eng-domain";
import { sharePreview } from "./eng-domain";

/** An immutable review is the only payload accepted by the sharing screen. */
export function reviewedShare(snapshot: EngSnapshot, id: string, selection: ShareSelection) {
  const memory = snapshot.data.memories.find(m => m.id === id && m.lifecycle !== "recently_deleted");
  if (!memory) throw Error("This memory is no longer available for sharing.");
  const preview = sharePreview(memory, snapshot.data, selection);
  if (preview.photos.length !== selection.photoIds.length) throw Error("A selected photo is no longer available. Review your selection again.");
  return { id, revision: snapshot.revision, memorySignature: JSON.stringify(memory), selection: { fields: [...selection.fields], photoIds: [...selection.photoIds] }, preview: { text: preview.text, photos: preview.photos.map(photo => ({ ...photo })) } };
}
export function validateReviewedShare(review: ReturnType<typeof reviewedShare>, snapshot: EngSnapshot) {
  const current = reviewedShare(snapshot, review.id, review.selection);
  if (snapshot.revision !== review.revision || current.memorySignature !== review.memorySignature || JSON.stringify(current.preview) !== JSON.stringify(review.preview)) {
    throw Error("Your saved memories changed. Return to memory details and review sharing again.");
  }
}
