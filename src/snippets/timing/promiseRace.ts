// First to SETTLE wins — a fast rejection beats a slow success.
// Race doesn't cancel the losers, so pass a signal and abort them yourself.
export async function raceAndAbort<T>(
  tasks: readonly ((signal: AbortSignal) => Promise<T>)[],
): Promise<T> {
  const controller = new AbortController();
  try {
    return await Promise.race(tasks.map((task) => task(controller.signal)));
  } finally {
    controller.abort(); // tell the losers to stop
  }
}
