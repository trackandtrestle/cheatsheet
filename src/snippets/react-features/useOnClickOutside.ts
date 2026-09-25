import { useEffect, useEffectEvent, type RefObject } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: Event) => void,
) {
  // Always calls the latest handler without re-subscribing when it changes
  // (so callers don't need useCallback).
  const onOutside = useEffectEvent(handler);

  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref.current;
      if (el && event.target instanceof Node && !el.contains(event.target)) onOutside(event);
    };
    // pointerdown covers mouse/touch/pen; focusin covers keyboard users tabbing away.
    document.addEventListener('pointerdown', listener);
    document.addEventListener('focusin', listener);
    return () => {
      document.removeEventListener('pointerdown', listener);
      document.removeEventListener('focusin', listener);
    };
  }, [ref]);
}
