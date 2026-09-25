/**
 * Throttle (leading + trailing): run at most once per `wait` ms.
 * Fires immediately, then once more at the end of the window with the latest args.
 */
export function throttle<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let lastRun = -Infinity;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let trailing: A | undefined;

  const run = (args: A) => {
    lastRun = Date.now();
    trailing = undefined;
    fn(...args);
  };

  const throttled = (...args: A): void => {
    const remaining = wait - (Date.now() - lastRun);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = undefined;
      run(args);
      return;
    }
    trailing = args; // remember the latest call for the trailing edge
    timer ??= setTimeout(() => {
      timer = undefined;
      if (trailing) run(trailing);
    }, remaining);
  };

  throttled.cancel = () => {
    clearTimeout(timer);
    timer = trailing = undefined;
  };
  return throttled;
}
