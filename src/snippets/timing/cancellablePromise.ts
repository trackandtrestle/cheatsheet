export class CancelledError extends Error {
  override name = 'CancelledError';
}

// Wrap any promise so the CONSUMER can stop waiting for it.
// Note: this only rejects the wrapper — the underlying work keeps running.
// If the work itself should stop, thread an AbortSignal into it instead.
export function makeCancellable<T>(work: Promise<T>): { promise: Promise<T>; cancel: () => void } {
  const { promise: cancelled, reject } = Promise.withResolvers<never>();
  return {
    promise: Promise.race([work, cancelled]),
    cancel: () => reject(new CancelledError('Cancelled')),
  };
}
