import { useCallback, useState } from 'react';

// Pure helper: always copy, then mutate the copy.
export function toggleIn<T>(prev: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(prev);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function useToggleSet<T>(initial: Iterable<T> = []) {
  const [selected, setSelected] = useState<ReadonlySet<T>>(() => new Set(initial));
  const toggle = useCallback((value: T) => setSelected((prev) => toggleIn(prev, value)), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  return { selected, toggle, clear } as const;
}

// BUG: mutating then passing the same Set back is ignored by React.
//   setSelected((prev) => { prev.add(value); return prev; }); // Object.is(prev, prev) -> no rerender
// Typing state as ReadonlySet<T> makes .add/.delete on it a compile error.
