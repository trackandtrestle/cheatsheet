export async function fetchUser(id: string, opts?: { signal?: AbortSignal }) {
  opts?.signal?.throwIfAborted();
  return { id, name: 'Ada', createdAt: new Date(0) };
}

// Derive types from the implementation instead of duplicating them.
export type FetchUserArgs = Parameters<typeof fetchUser>;
// ReturnType gives Promise<...>; Awaited unwraps it (recursively).
export type FetchUserResult = Awaited<ReturnType<typeof fetchUser>>;

// Typical use: a wrapper that keeps the wrapped function's signature.
export function withRetry<F extends (...args: never[]) => Promise<unknown>>(fn: F, attempts = 3) {
  return async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    let lastError: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        return (await fn(...args)) as Awaited<ReturnType<F>>;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };
}
