import { onScopeDispose, toValue, type MaybeRefOrGetter } from 'vue';

type OutsideEvent = PointerEvent | FocusEvent;

/**
 * Calls `handler` when the user points at OR tabs focus to something outside
 * `target`. `focusin` matters: keyboard users never fire pointer events.
 */
export function useOnClickOutside(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  handler: (event: OutsideEvent) => void,
): void {
  if (typeof document === 'undefined') return;

  const listener = (event: OutsideEvent) => {
    const el = toValue(target);
    // composedPath() also works for targets inside shadow DOM / portals
    if (!el || event.composedPath().includes(el)) return;
    handler(event);
  };

  // capture phase: still fires if a child calls stopPropagation()
  document.addEventListener('pointerdown', listener, true);
  document.addEventListener('focusin', listener, true);
  onScopeDispose(() => {
    document.removeEventListener('pointerdown', listener, true);
    document.removeEventListener('focusin', listener, true);
  });
}
