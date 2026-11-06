type RouteState = { index?: number; routes: readonly { name: string; params?: object; state?: RouteState }[] };
/** Route parameters alone are not proof of a return destination. */
export function hasMatchingDetailHistory(state: RouteState | undefined, id: string): boolean {
  if (!state || !id) return false;
  const index = state.index ?? state.routes.length - 1;
  const current = state.routes[index];
  if (current?.state) return hasMatchingDetailHistory(current.state, id);
  const prior = state.routes[index - 1];
  return current?.name === "share" && (current.params as { id?: unknown } | undefined)?.id === id &&
    prior?.name === "card" && (prior.params as { id?: unknown } | undefined)?.id === id;
}
