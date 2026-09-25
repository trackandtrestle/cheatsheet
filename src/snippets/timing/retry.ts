export interface RetryOptions {
  retries?: number; // extra attempts after the first
  baseMs?: number;
  maxMs?: number;
  jitter?: boolean; // "full jitter": random delay in [0, backoff)
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

// Exponential backoff: baseMs, 2×, 4×… capped at maxMs.
export async function retry<T>(
  task: (attempt: number) => Promise<T>,
  { retries = 3, baseMs = 200, maxMs = 5_000, jitter = true, shouldRetry = () => true }: RetryOptions = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await task(attempt);
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error, attempt)) throw error;
      const backoff = Math.min(maxMs, baseMs * 2 ** attempt);
      const delay = jitter ? Math.random() * backoff : backoff;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Usage: only retry transient failures (network / 5xx / 429), never other 4xx.
export function isTransient(error: unknown): boolean {
  const status = error instanceof Error && 'status' in error ? error.status : undefined;
  return typeof status !== 'number' || status >= 500 || status === 429;
}
