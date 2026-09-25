// ES2023 "change array by copy" methods: return a NEW array, never mutate.
// Ideal for React state and readonly arrays.
const nums: readonly number[] = [3, 1, 2];

export const sorted = nums.toSorted((a, b) => a - b); // [1, 2, 3]
export const reversed = nums.toReversed(); // [2, 1, 3]
export const replaced = nums.with(1, 99); // [3, 99, 2]
export const removed = nums.toSpliced(0, 1); // [1, 2]
export const inserted = nums.toSpliced(1, 0, 7, 8); // [3, 7, 8, 1, 2]
export const original = nums; // still [3, 1, 2]

// with() supports negative indexes but THROWS on out-of-range (unlike arr[i] = x).
export const lastReplaced = nums.with(-1, 0); // [3, 1, 0]

// Typical reducer usage:
export function toggleAt(flags: readonly boolean[], i: number): boolean[] {
  const cur = flags.at(i);
  return cur === undefined ? [...flags] : flags.with(i, !cur);
}
