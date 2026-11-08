import { parseData, type Data } from "./model";
import { validateMediaManifest, type MediaManifest } from "./media-manifest";
/** Manifest-only preflight. No media bytes are restored or replaced. */
export interface PortableMediaPreview {
  text: Data;
  manifest: MediaManifest;
  totalBytes: number;
}
export function previewMediaBackup(textJson: string, rawManifest: unknown): PortableMediaPreview {
  const text = parseData(textJson);
  const manifest = validateMediaManifest(rawManifest, text.cards.map(c => c.id));
  const totalBytes = manifest.media.reduce((sum, file) => sum + file.bytes, 0);
  return { text, manifest, totalBytes };
}
/** Fail-closed preflight; nothing may be written until every declared media file passes. */
export async function verifyPortableMediaPayload(
  preview: PortableMediaPreview,
  readEntry: (relativePath: string) => Promise<Uint8Array>,
  sha256: (bytes: Uint8Array) => Promise<string>,
): Promise<void> {
  const { verifyMediaBytes } = await import("./media-integrity");
  for (const entry of preview.manifest.media) {
    const bytes = await readEntry(entry.path);
    await verifyMediaBytes(entry, bytes, sha256);
  }
}

