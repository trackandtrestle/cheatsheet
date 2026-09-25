export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

// Add: spread into a NEW array (never push onto state).
export const append = <T>(list: readonly T[], item: T): T[] => [...list, item];
export const prepend = <T>(list: readonly T[], item: T): T[] => [item, ...list];

// Remove: filter returns a new array; removing a missing id is a no-op copy.
export const removeById = <T extends { id: string }>(list: readonly T[], id: string): T[] =>
  list.filter((item) => item.id !== id);

// Remove by index (e.g. list without ids) — toSpliced is the non-mutating splice.
export const removeAt = <T>(list: readonly T[], index: number): T[] => list.toSpliced(index, 1);

// Usage with useState:
//   setTodos((prev) => append(prev, { id: crypto.randomUUID(), text, done: false }));
//   setTodos((prev) => removeById(prev, id));
