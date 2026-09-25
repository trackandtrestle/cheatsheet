// Move an element from one index to another, returning a new array.
// Out-of-range or no-op moves return the SAME reference, so React skips the rerender.
export function moveItem<T>(list: readonly T[], from: number, to: number): readonly T[] {
  const inRange = (i: number) => i >= 0 && i < list.length;
  if (!inRange(from) || !inRange(to) || from === to) return list;
  const item = list[from] as T; // bounds checked above
  return list.toSpliced(from, 1).toSpliced(to, 0, item);
}

// Move up/down by id — what "reorder" buttons call.
export function moveById<T extends { id: string }>(
  list: readonly T[],
  id: string,
  delta: -1 | 1,
): readonly T[] {
  const from = list.findIndex((x) => x.id === id);
  const to = from + delta;
  return from === -1 ? list : moveItem(list, from, to);
}

// Swap two positions using .with().
export function swap<T>(list: readonly T[], i: number, j: number): T[] {
  const a = list.at(i);
  const b = list.at(j);
  if (a === undefined || b === undefined) throw new RangeError('index out of range');
  return list.with(i, b).with(j, a);
}

// Usage:  setTodos((prev) => moveById(prev, id, -1));
// Render with key={todo.id}, never key={index}, or state/focus sticks to the slot.
