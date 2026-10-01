import { shallowRef, triggerRef } from 'vue';

export interface Row {
  id: number;
  done: boolean;
}

// shallowRef: only `.value` assignment is tracked; the contents are NOT made reactive.
// Ideal for big lists/immutable data you replace wholesale (no deep proxy cost).
export function useRows(initial: Row[]) {
  const rows = shallowRef(initial);

  // ✓ Replace the value — tracked.
  const toggle = (id: number) => {
    rows.value = rows.value.map((r) => (r.id === id ? { ...r, done: !r.done } : r));
  };

  // ✗ In-place mutation — invisible to watchers, computed and the template...
  const toggleInPlace = (id: number) => {
    const row = rows.value.find((r) => r.id === id);
    if (row) row.done = !row.done;
  };

  // ...unless you force a notification afterwards.
  const forceUpdate = () => triggerRef(rows);

  return { rows, toggle, toggleInPlace, forceUpdate };
}
