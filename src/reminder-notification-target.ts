/** Expo Router has already decoded query values. Never decode an identifier twice. */
export function reminderNotificationTarget(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 && value.length <= 512
    && !/[\u0000-\u001f\u007f]/.test(value) ? value : null;
}
