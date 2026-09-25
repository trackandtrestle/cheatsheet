import { useRef, useState, type KeyboardEvent } from 'react';

type Orientation = 'horizontal' | 'vertical';
const KEYS: Record<Orientation, [prev: string, next: string]> = {
  horizontal: ['ArrowLeft', 'ArrowRight'],
  vertical: ['ArrowUp', 'ArrowDown'],
};

// One tab stop for the whole group (toolbar, radio group, tabs): the active item has
// tabIndex=0, the rest -1. Arrows move REAL focus (unlike aria-activedescendant).
export function useRovingTabIndex(count: number, orientation: Orientation = 'horizontal') {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);

  const focus = (i: number) => {
    const next = (i + count) % count; // wrap around
    setActive(next);
    items.current[next]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const [prev, next] = KEYS[orientation];
    const target = { [prev]: active - 1, [next]: active + 1, Home: 0, End: count - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    focus(target);
  };

  const getItemProps = (i: number) => ({
    ref: (el: HTMLElement | null) => { items.current[i] = el; },
    tabIndex: i === active ? 0 : -1,
    onKeyDown,
    onFocus: () => setActive(i), // clicking an item makes it the tab stop too
  });
  return { active, getItemProps };
}
