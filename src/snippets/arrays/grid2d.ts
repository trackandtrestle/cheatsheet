// TRAP: fill() puts the SAME array reference in every slot.
export function brokenGrid(rows: number): number[][] {
  return Array<number[]>(rows).fill([]);
}

// Correct: the factory runs once per row, creating a fresh array each time.
export function makeGrid<T>(rows: number, cols: number, init: T): T[][] {
  return Array.from({ length: rows }, () => Array<T>(cols).fill(init));
}

// Same trap one level down if `init` is an object: build it per cell.
export function makeGridWith<T>(rows: number, cols: number, make: (r: number, c: number) => T) {
  return Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => make(r, c)));
}

// Reading with noUncheckedIndexedAccess: grid[r]?.[c] is T | undefined.
export const cellOr = <T,>(grid: T[][], r: number, c: number, fallback: T): T =>
  grid[r]?.[c] ?? fallback;
