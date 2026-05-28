const store = new Map<string, number>();

export function checkRateLimit(key: string, cooldownMs: number = 60_000): boolean {
  const now = Date.now();
  const last = store.get(key);
  if (last && now - last < cooldownMs) {
    return false;
  }
  store.set(key, now);
  return true;
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cutoff = Date.now() - 60_000;
    store.forEach((time, key) => {
      if (time < cutoff) store.delete(key);
    });
  }, 5 * 60_000);
}
