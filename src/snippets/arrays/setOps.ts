// Array.includes inside filter is O(n·m). Build a Set once: O(n + m).
export function intersection<T>(a: readonly T[], b: readonly T[]): T[] {
  const inB = new Set(b);
  return a.filter((x) => inB.has(x));
}

export function difference<T>(a: readonly T[], b: readonly T[]): T[] {
  const inB = new Set(b);
  return a.filter((x) => !inB.has(x));
}

export const union = <T,>(a: readonly T[], b: readonly T[]): T[] => [...new Set([...a, ...b])];

export function symmetricDifference<T>(a: readonly T[], b: readonly T[]): T[] {
  return [...difference(a, b), ...difference(b, a)];
}

// Objects: compare by a key, since Set uses reference identity.
export function differenceBy<T, K>(a: readonly T[], b: readonly T[], key: (x: T) => K): T[] {
  const keys = new Set(b.map(key));
  return a.filter((x) => !keys.has(key(x)));
}
