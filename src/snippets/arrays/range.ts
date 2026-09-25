// Array.from({ length }, fn): the idiomatic "generate N items".
export const squares = (n: number): number[] => Array.from({ length: n }, (_, i) => i * i);

// range(start, end, step) — end exclusive, like Python.
export function range(start: number, end: number, step = 1): number[] {
  if (step === 0) throw new RangeError('step cannot be 0');
  const length = Math.max(0, Math.ceil((end - start) / step));
  return Array.from({ length }, (_, i) => start + i * step);
}

// Trap: new Array(n).map(fn) does nothing — the slots are EMPTY (holes).
export const holes = new Array<number>(3).map(() => 1); // [ <3 empty items> ]
export const filled = new Array<number>(3).fill(0).map((_, i) => i); // [0, 1, 2]

// Also works on iterables: Array.from(set / map.keys() / string).
export const letters = Array.from('abc', (c) => c.toUpperCase()); // ['A', 'B', 'C']
