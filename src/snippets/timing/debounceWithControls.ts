export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  /** Drop the pending call. Use on unmount / route change. */
  cancel(): void;
  /** Run the pending call right now (e.g. save before navigating away). */
  flush(): void;
  /** Is a call scheduled? (e.g. show "saving…"). */
  pending(): boolean;
}

export function debounceWithControls<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
): Debounced<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: A | undefined;

  const invoke = () => {
    const args = lastArgs;
    timer = lastArgs = undefined;
    if (args) fn(...args);
  };

  const debounced = (...args: A) => {
    lastArgs = args;
    clearTimeout(timer);
    timer = setTimeout(invoke, wait);
  };

  return Object.assign(debounced, {
    cancel: () => {
      clearTimeout(timer);
      timer = lastArgs = undefined;
    },
    flush: () => {
      clearTimeout(timer);
      invoke();
    },
    pending: () => timer !== undefined,
  });
}
