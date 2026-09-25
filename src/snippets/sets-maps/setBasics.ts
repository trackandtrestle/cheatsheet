// A Set stores each value once, compared with SameValueZero.
export function setBasics() {
  const s = new Set<number>([3, 1, 3, 2]); // duplicates dropped -> {3, 1, 2}
  s.add(1).add(4); // add is chainable; re-adding is a no-op
  const had = s.delete(3); // true if it was present
  return { values: [...s], size: s.size, had, hasTwo: s.has(2) };
}

// SameValueZero: NaN equals NaN, and +0 equals -0.
export function sameValueZero() {
  const s = new Set([NaN, NaN, 0, -0]);
  return s.size; // 2
}

// Objects are compared by identity, not structure.
export function objectIdentity() {
  const a = { id: 1 };
  const s = new Set([a, { id: 1 }]); // two distinct objects
  return { size: s.size, hasA: s.has(a), hasCopy: s.has({ id: 1 }) };
}

// De-duplicate while keeping first-seen order.
export const unique = <T>(items: Iterable<T>): T[] => [...new Set(items)];
