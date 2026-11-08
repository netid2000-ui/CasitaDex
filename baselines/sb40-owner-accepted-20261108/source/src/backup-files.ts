import type { Data } from "./model";

export async function saveBackupFile(_data: Data): Promise<string> {
  throw new Error("File backup export is not supported on this platform yet.");
}

export async function pickBackupFile(): Promise<string | null> {
  throw new Error("File backup import is not supported on this platform yet.");
}
