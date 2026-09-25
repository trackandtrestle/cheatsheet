// Repeat every `ms` until stopped. Always keep the handle so you can clear it.
export function every(ms: number, tick: (count: number) => void): () => void {
  let count = 0;
  const id = setInterval(() => tick(++count), ms);
  return () => clearInterval(id);
}

// Drift-corrected ticker: each tick is scheduled against the start time,
// so time spent in callbacks (or timer clamping) doesn't accumulate.
export function everyAligned(ms: number, tick: (count: number) => void): () => void {
  const start = Date.now();
  let count = 0;
  let id: ReturnType<typeof setTimeout>;
  const schedule = () => {
    const due = start + (count + 1) * ms;
    id = setTimeout(() => {
      tick(++count);
      schedule();
    }, Math.max(0, due - Date.now()));
  };
  schedule();
  return () => clearTimeout(id);
}
