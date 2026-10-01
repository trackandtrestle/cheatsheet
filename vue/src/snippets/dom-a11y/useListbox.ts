import { computed, useId, type Ref } from 'vue';

/** Pure key -> index mapping: easy to unit-test, reusable for menus and grids. */
export function nextIndex(key: string, current: number, count: number): number | null {
  switch (key) {
    case 'ArrowDown': return Math.min(current + 1, count - 1); // listboxes don't wrap by default
    case 'ArrowUp': return Math.max(current - 1, 0);
    case 'Home': return 0;
    case 'End': return count - 1;
    default: return null;
  }
}

// Single-select listbox, one tab stop, selection follows focus. Pass a defineModel() ref.
export function useListbox<T extends string>(options: readonly T[], selected: Ref<T>) {
  const id = useId();
  const index = computed(() => options.indexOf(selected.value));
  const typeAhead = (key: string) => { // next option starting with the letter, wrapping
    const rotated = [...options.slice(index.value + 1), ...options.slice(0, index.value + 1)];
    const hit = rotated.find((o) => o.toLowerCase().startsWith(key.toLowerCase()));
    return hit === undefined ? null : options.indexOf(hit);
  };
  function onKeydown(e: KeyboardEvent) {
    const next = nextIndex(e.key, index.value, options.length) ?? (e.key.length === 1 ? typeAhead(e.key) : null);
    const value = next === null ? undefined : options[next];
    if (value === undefined) return;
    e.preventDefault(); // stop arrows/Home/End/Space from scrolling the page
    selected.value = value;
    document.getElementById(`${id}-${next}`)?.scrollIntoView?.({ block: 'nearest' });
  }
  const listboxAttrs = computed(() => ({
    role: 'listbox', tabindex: 0, 'aria-activedescendant': `${id}-${index.value}`, onKeydown,
  }));
  const optionAttrs = (i: number) => ({
    id: `${id}-${i}`, role: 'option', 'aria-selected': i === index.value,
    onClick: () => { const v = options[i]; if (v !== undefined) selected.value = v; },
  });
  return { listboxAttrs, optionAttrs };
}
