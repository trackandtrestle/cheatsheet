// Default sort converts to strings and compares UTF-16 code units.
export const defaultSorted = [1, 10, 2, 21].sort(); // [1, 10, 2, 21]

// Numbers need a comparator: negative => a first, positive => b first.
export const ascending = (xs: number[]): number[] => [...xs].sort((a, b) => a - b);
export const descending = (xs: number[]): number[] => [...xs].sort((a, b) => b - a);

// sort() MUTATES and returns the same array. Copy first, or use toSorted().
export function sortInPlaceTrap(xs: number[]): boolean {
  const sorted = xs.sort((a, b) => a - b);
  return sorted === xs; // true — caller's array changed
}

// Dates: compare timestamps. BigInt: a - b is a bigint, not a number.
export const byDate = (ds: Date[]): Date[] => ds.toSorted((a, b) => a.getTime() - b.getTime());
export const byBigInt = (xs: bigint[]): bigint[] =>
  xs.toSorted((a, b) => (a < b ? -1 : a > b ? 1 : 0));
