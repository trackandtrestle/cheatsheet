import { useEffect, useEffectEvent, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

// Keep Tab inside `ref` while mounted, close on Escape, and restore focus afterwards.
export function useFocusTrap(ref: RefObject<HTMLElement | null>, onEscape: () => void) {
  const handleEscape = useEffectEvent(onEscape); // latest callback, not a dependency

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const opener = document.activeElement as HTMLElement | null;
    // Query on every keydown so elements added after opening are included.
    const focusables = () => [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.closest('[hidden], [inert]'));
    (focusables()[0] ?? root).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return handleEscape();
      if (e.key !== 'Tab') return;
      const els = focusables();
      const first = els[0], last = els.at(-1);
      if (!first || !last) return e.preventDefault(); // nothing to focus: stay put
      const current = document.activeElement;
      if (e.shiftKey && (current === first || !root.contains(current))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (current === last || !root.contains(current))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      opener?.focus(); // return focus to the button that opened the dialog
    };
  }, [ref]);
}
