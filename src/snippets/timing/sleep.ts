// Promise-based delay that can be aborted (rejects with `signal.reason`).
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const onAbort = () => {
      clearTimeout(id);
      reject(signal?.reason);
    };
    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// Usage: poll until ready, stoppable from outside.
export async function pollUntil(check: () => Promise<boolean>, everyMs: number, signal?: AbortSignal) {
  while (!(await check())) await sleep(everyMs, signal);
}
