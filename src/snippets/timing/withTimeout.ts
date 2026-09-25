export class TimeoutError extends Error {
  override name = 'TimeoutError';
  constructor(readonly ms: number) {
    super(`Timed out after ${ms} ms`);
  }
}

// Reject if `promise` hasn't settled within `ms`. Always clears the timer,
// so a fast promise doesn't leave a pending timeout keeping Node alive.
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let id: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    id = setTimeout(() => reject(new TimeoutError(ms)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(id));
}
