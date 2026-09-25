// Schedule once; keep the handle so you can cancel.
export function scheduleGreeting(onGreet: (msg: string) => void, delayMs: number) {
  const id = setTimeout(() => onGreet('hello'), delayMs);
  return () => clearTimeout(id); // cancel function
}

// Portable handle type: number in browsers, Timeout object in Node.
export type TimeoutHandle = ReturnType<typeof setTimeout>;

// Delay 0 still runs *after* the current task and pending microtasks.
export function orderDemo(log: string[]) {
  setTimeout(() => log.push('timeout'), 0);
  queueMicrotask(() => log.push('microtask'));
  void Promise.resolve().then(() => log.push('promise'));
  log.push('sync');
}
