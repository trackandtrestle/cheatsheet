// Primitives: Set keeps first occurrence, in insertion order. O(n).
export const unique = <T,>(xs: Iterable<T>): T[] => [...new Set(xs)];

// Set uses SameValueZero: NaN dedupes, +0/-0 are equal, objects by reference.
export const uniqueCount = (xs: unknown[]): number => new Set(xs).size;

// O(n²) classic — avoid for large inputs, and it drops NaN (indexOf can't find it).
export const uniqueSlow = <T,>(xs: T[]): T[] => xs.filter((x, i) => xs.indexOf(x) === i);

// Case-insensitive: dedupe on a normalized key, keep the original value.
export function uniqueIgnoreCase(xs: string[]): string[] {
  const seen = new Set<string>();
  return xs.filter((x) => {
    const k = x.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
