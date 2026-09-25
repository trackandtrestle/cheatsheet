/**
 * Leading debounce: run `fn` IMMEDIATELY on the first call of a burst,
 * then ignore calls until there has been `wait` ms of quiet.
 * Classic use: preventing double-submits / double-clicks.
 */
export function debounceLeading<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: A): void => {
    if (timer === undefined) fn(...args); // first call of the burst
    clearTimeout(timer); // any call extends the quiet period
    timer = setTimeout(() => {
      timer = undefined; // burst over; next call fires again
    }, wait);
  };
}
