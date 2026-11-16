/** Inline calendars require room for all seven weekday columns. */
export function reminderPickerDisplay(mode: "date" | "time", width: number, fontScale: number, large: boolean): "inline" | "spinner" {
  return mode === "date" && width >= 390 && fontScale < 1.35 && !large ? "inline" : "spinner";
}
