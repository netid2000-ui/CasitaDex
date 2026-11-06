/**
 * Keep the approved four destinations in one row, or two explicit rows at
 * narrow widths / larger system text. Do not use percentage flex-basis with
 * flex-wrap here: Yoga can resolve that to four full-width rows after an iOS
 * landscape / Dynamic Type change and leave the screen with no content area.
 * Each row stretches to the safe-area width; its tabs share that actual width.
 */
export function primaryNavigationRows<T>(
  destinations: readonly T[],
  availableWidth: number,
  fontScale: number,
): readonly (readonly T[])[] {
  const columns = availableWidth < 365 * Math.max(1, fontScale) ? 2 : 4;
  const rows: T[][] = [];
  for (let index = 0; index < destinations.length; index += columns) {
    rows.push(destinations.slice(index, index + columns));
  }
  return rows;
}
