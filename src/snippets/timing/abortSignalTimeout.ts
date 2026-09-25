// Built-in deadlines: AbortSignal.timeout(ms) aborts with a 'TimeoutError',
// AbortSignal.any([...]) aborts when ANY input signal does.
export function fetchWithDeadline(url: string, ms: number, userSignal?: AbortSignal) {
  const signals = [AbortSignal.timeout(ms)];
  if (userSignal) signals.push(userSignal);
  return fetch(url, { signal: AbortSignal.any(signals) });
}

// Distinguish "took too long" from "user cancelled".
export function abortKind(error: unknown): 'timeout' | 'cancelled' | 'other' {
  const name = typeof error === 'object' && error !== null && 'name' in error ? error.name : null;
  if (name === 'TimeoutError') return 'timeout';
  return name === 'AbortError' ? 'cancelled' : 'other';
}
