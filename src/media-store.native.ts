import { Directory, File, Paths } from "expo-file-system";
import type { MediaStore } from "./media-staging";
const idRe = /^[A-Za-z0-9_-]{1,100}$/;
const pathRe = /^media\/([A-Za-z0-9_-]{1,100})\.(jpg|png|webp)$/;
function id(value: string) { if (!idRe.test(value)) throw new Error("Invalid media ID"); return value; }
function name(path: string) { if (!pathRe.test(path)) throw new Error("Unsafe media path"); return path.slice(6); }
/** Private document directory adapter; not wired into the app until native acceptance. */
export function createNativeMediaStore(): MediaStore {
  const root = new Directory(Paths.document, "casitadex-media-v2");
  const temporary = new Directory(root, "staging");
  const managed = new Directory(root, "media");
  function setup() { root.create({ idempotent: true }); temporary.create({ idempotent: true }); managed.create({ idempotent: true }); }
  return {
    async writeTemporary(key, bytes) {
      setup(); const f = new File(temporary, `${id(key)}.tmp`);
      f.create({ overwrite: false }); f.write(bytes);
    },
    async readTemporary(key) {
      const f = new File(temporary, `${id(key)}.tmp`);
      if (!f.exists) throw new Error("Missing staged media");
      return f.bytes();
    },
    async promote(key, path) {
      setup(); const src = new File(temporary, `${id(key)}.tmp`);
      const dest = new File(managed, name(path));
      if (!src.exists || dest.exists) throw new Error("Missing staged media or destination exists");
      src.move(dest);
    },
    async removeTemporary(key) {
      const f = new File(temporary, `${id(key)}.tmp`); if (f.exists) f.delete();
    },
    async removeUnreferenced(path) {
      const f = new File(managed, name(path)); if (f.exists) f.delete();
    },
  };
}