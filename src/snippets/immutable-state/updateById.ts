interface Item {
  id: string;
}

// Replace one element; every other element keeps its reference (cheap memo checks).
export function updateById<T extends Item>(
  list: readonly T[],
  id: string,
  patch: Partial<Omit<T, 'id'>> | ((item: T) => T),
): T[] {
  return list.map((item) => {
    if (item.id !== id) return item;
    return typeof patch === 'function' ? patch(item) : { ...item, ...patch };
  });
}

// Update by index: Array.prototype.with is the immutable `arr[i] = x`.
export const replaceAt = <T>(list: readonly T[], index: number, value: T): T[] =>
  list.with(index, value);

// Usage:
//   setTodos((prev) => updateById(prev, id, { done: true }));
//   setTodos((prev) => updateById(prev, id, (t) => ({ ...t, done: !t.done })));
