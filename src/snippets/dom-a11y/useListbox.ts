import { useId, useState, type KeyboardEvent } from 'react';

/** Pure key -> index mapping: easy to unit-test, reusable for menus and grids. */
export function nextIndex(key: string, current: number, count: number): number | null {
  const last = count - 1;
  switch (key) {
    case 'ArrowDown': return Math.min(current + 1, last); // listboxes don't wrap by default
    case 'ArrowUp': return Math.max(current - 1, 0);
    case 'Home': return 0;
    case 'End': return last;
    default: return null;
  }
}

// Single-select listbox: the <ul> is the one tab stop; selection follows focus.
export function useListbox<T extends string>(options: readonly T[], initial: T) {
  const id = useId();
  const [selected, setSelected] = useState(initial);
  const index = options.indexOf(selected);
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    let next = nextIndex(e.key, index, options.length);
    if (next === null && e.key.length === 1) { // type-ahead on first letter
      const k = e.key.toLowerCase();
      const i = options.findIndex((o, j) => j > index && o.toLowerCase().startsWith(k));
      next = i >= 0 ? i : options.findIndex((o) => o.toLowerCase().startsWith(k));
    }
    const value = next === null ? undefined : options[next];
    if (value === undefined) return;
    e.preventDefault(); // stop the page from scrolling
    setSelected(value);
    document.getElementById(`${id}-${next}`)?.scrollIntoView?.({ block: 'nearest' });
  };
  const listboxProps = { role: 'listbox', tabIndex: 0, onKeyDown, 'aria-activedescendant': `${id}-${index}` };
  const getOptionProps = (i: number) => ({ id: `${id}-${i}`, role: 'option', 'aria-selected': i === index,
    onClick: () => { const v = options[i]; if (v !== undefined) setSelected(v); } });
  return { selected, listboxProps, getOptionProps };
}
