const listeners = new Set<() => void>();

export function subscribeReminderChanges(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function notifyReminderChanges() {
  for (const listener of listeners) listener();
}
