import { computed, ref } from 'vue';

type Orientation = 'horizontal' | 'vertical';
const KEYS: Record<Orientation, [prev: string, next: string]> = {
  horizontal: ['ArrowLeft', 'ArrowRight'],
  vertical: ['ArrowUp', 'ArrowDown'],
};

// One tab stop for the whole group (toolbar, radio group, tabs): the active item has
// tabindex=0, the rest -1. Arrows move REAL focus (unlike aria-activedescendant).
export function useRovingTabIndex(orientation: Orientation = 'horizontal') {
  const active = ref(0);

  // Bound on the container: keydown bubbles up from the focused item.
  function onKeydown(e: KeyboardEvent) {
    if (!(e.currentTarget instanceof HTMLElement)) return;
    // Items are found in DOM order (template-ref arrays don't guarantee v-for order).
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-roving-item]')];
    const [prev, next] = KEYS[orientation];
    const n = items.length;
    const target = { [prev]: active.value - 1, [next]: active.value + 1, Home: 0, End: n - 1 }[e.key];
    if (target === undefined || n === 0) return;
    e.preventDefault();
    active.value = (target + n) % n; // wrap around
    items[active.value]?.focus();
  }

  const containerAttrs = computed(() => ({ 'aria-orientation': orientation, onKeydown }));
  const itemAttrs = (i: number) => ({
    'data-roving-item': '',
    tabindex: i === active.value ? 0 : -1,
    onFocus: () => (active.value = i), // clicking an item makes it the tab stop too
  });
  return { active, containerAttrs, itemAttrs };
}
