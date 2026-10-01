import { onWatcherCleanup, toValue, watch, type MaybeRefOrGetter } from 'vue';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

// Traps Tab inside `target` while it is rendered (e.g. a v-if'd dialog's template ref),
// closes on Escape, and restores focus to the opener when it goes away.
export function useFocusTrap(target: MaybeRefOrGetter<HTMLElement | null>, onEscape: () => void) {
  watch(() => toValue(target), (root) => {
    if (!root) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // Query on every keydown so elements added after opening are included.
    const focusables = () =>
      [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.closest('[hidden], [inert]'));
    (focusables()[0] ?? root).focus();

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onEscape();
      if (e.key !== 'Tab') return;
      const els = focusables();
      const first = els[0], last = els.at(-1), current = document.activeElement;
      if (!first || !last) return e.preventDefault(); // nothing to focus: stay put
      if (e.shiftKey && (current === first || !root.contains(current))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (current === last || !root.contains(current))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeydown);
    onWatcherCleanup(() => { // element removed, or the owning component unmounted
      document.removeEventListener('keydown', onKeydown);
      opener?.focus();
    });
  }, { immediate: true, flush: 'post' }); // post: the element is in the DOM
}
