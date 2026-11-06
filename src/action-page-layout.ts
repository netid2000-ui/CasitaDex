/** Reserve content space even when actions wrap at maximum text size or a keyboard is open. */
export function actionRegionLimit(availableHeight: number) {
  return Math.max(1, Math.floor(Math.max(0, availableHeight) * 0.4));
}
export function actionColumns(width: number, fontScale: number, large: boolean) {
  return width >= 320 * Math.max(1, fontScale) * (large ? 2 : 1) ? 2 : 1;
}
