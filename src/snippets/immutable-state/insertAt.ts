// Insert at an index: toSpliced(start, deleteCount, ...items) never mutates.
export const insertAt = <T>(list: readonly T[], index: number, ...items: T[]): T[] =>
  list.toSpliced(index, 0, ...items);

// Equivalent with slices (works on older targets without ES2023).
export const insertAtSlice = <T>(list: readonly T[], index: number, item: T): T[] => [
  ...list.slice(0, index),
  item,
  ...list.slice(index),
];

// Insert after the element with a given id (or append if not found).
export function insertAfter<T extends { id: string }>(list: readonly T[], id: string, item: T): T[] {
  const i = list.findIndex((x) => x.id === id);
  return i === -1 ? [...list, item] : list.toSpliced(i + 1, 0, item);
}

// Usage:
//   setRows((prev) => insertAt(prev, 2, newRow));
