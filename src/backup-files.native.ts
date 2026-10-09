import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { exportData, parseData, type Data } from "./model";

/** Explicit Android Storage Access Framework export; never uploads automatically. */
export async function saveBackupFile(data: Data): Promise<string> {
  if (Platform.OS !== "android") throw new Error("File export is available on Android only.");
  const backup = exportData(data);
  const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permission.granted) return "Backup canceled. Nothing was exported.";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  let uri: string | null = null;
  try {
    uri = await FileSystem.StorageAccessFramework.createFileAsync(
      permission.directoryUri,
      `CasitaDex-backup-${stamp}`,
      "application/json",
    );
    await FileSystem.writeAsStringAsync(uri, backup, { encoding: FileSystem.EncodingType.UTF8 });
    const check = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 });
    if (check !== backup || exportData(parseData(check)) !== backup) {
      throw new Error("Backup read-back verification failed.");
    }
    return "Backup saved and verified in the selected folder. Keep an independent second copy.";
  } catch (error) {
    let cleanup = "";
    if (uri) {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch {
        cleanup = " A possibly incomplete file may remain in your chosen folder; delete it manually.";
      }
    }
    const detail = error instanceof Error ? error.message : "File provider failure";
    throw new Error(`Backup did not complete: ${detail}. Do not rely on this export.${cleanup}`);
  }
}

/** Reads a selected file but never writes to the application database. */
export async function pickBackupFile(): Promise<string | null> {
  if (Platform.OS !== "android") throw new Error("File import is available on Android only.");
  const picked = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: ["application/json", "text/plain", "application/octet-stream"],
  });
  if (picked.canceled) return null;
  const asset = picked.assets[0];
  if (!asset) throw new Error("No backup file was selected.");
  if (asset.size !== undefined && asset.size > 2_000_000) {
    throw new Error("Backup is too large. Maximum size is 2 MB.");
  }
  const raw = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
  return exportData(parseData(raw));
}
