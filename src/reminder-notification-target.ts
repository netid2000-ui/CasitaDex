/** The installed Router hook has already decoded route transport values.
 * Validate only: decoding again would corrupt a literal percent sequence. */
export function reminderNotificationTarget(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 && value.length <= 512
    && !/[\u0000-\u001f\u007f]/.test(value) ? value : null;
}
