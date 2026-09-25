// Wait for EVERY task, never rejects; then split successes from failures.
export async function settleAll<T>(tasks: readonly (() => Promise<T>)[]) {
  const results = await Promise.allSettled(tasks.map((task) => task()));
  const values: T[] = [];
  const errors: unknown[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') values.push(result.value);
    else errors.push(result.reason);
  }
  return { values, errors };
}
