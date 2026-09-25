/**
 * Leading + trailing debounce: fire on the first call (instant feedback) and
 * again after the burst ends, but only if more calls arrived during the burst.
 */
export function debounceLeadingTrailing<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: A | undefined; // latest args not yet delivered

  return (...args: A): void => {
    if (timer === undefined) fn(...args);
    else pending = args;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      if (pending) {
        const last = pending;
        pending = undefined;
        fn(...last);
      }
    }, wait);
  };
}
