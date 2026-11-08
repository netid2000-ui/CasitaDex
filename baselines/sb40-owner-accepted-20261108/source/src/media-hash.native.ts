import * as Crypto from "expo-crypto";
/** Native SHA-256 adapter for the portable media verification contract. */
export async function sha256Media(bytes: Uint8Array): Promise<string> {
  const digest = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, Uint8Array.from(bytes));
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
}

