export class StaleError extends Error {
  override name = 'StaleError';
}

// Only the most recent call's result is delivered. Earlier calls are aborted
// and REJECT with StaleError (never left pending), so callers can ignore them.
export function takeLatest<A extends unknown[], R>(
  fn: (signal: AbortSignal, ...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  let current: AbortController | undefined;
  return async (...args) => {
    current?.abort();
    const controller = new AbortController();
    current = controller;
    const outcome = await fn(controller.signal, ...args).then(
      (value) => ({ ok: true as const, value }),
      (error: unknown) => ({ ok: false as const, error }),
    );
    if (controller !== current) throw new StaleError('Superseded by a newer call');
    if (!outcome.ok) throw outcome.error;
    return outcome.value;
  };
}
