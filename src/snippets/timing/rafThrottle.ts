/**
 * Coalesce calls to at most one per animation frame, using the latest args.
 * Ideal for scroll / resize / pointermove handlers that touch layout.
 */
export function rafThrottle<A extends unknown[]>(fn: (...args: A) => void) {
  let frame: number | undefined;
  let latest: A | undefined;

  const throttled = (...args: A): void => {
    latest = args;
    frame ??= requestAnimationFrame(() => {
      frame = undefined;
      if (latest) fn(...latest);
    });
  };

  throttled.cancel = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = latest = undefined;
  };
  return throttled;
}

export function onScrollFrame(cb: (scrollY: number) => void): () => void {
  const handler = rafThrottle(() => cb(window.scrollY));
  window.addEventListener('scroll', handler, { passive: true });
  return () => {
    window.removeEventListener('scroll', handler);
    handler.cancel();
  };
}
