// Sets/Maps compare objects & arrays by identity, so tuple keys don't "work".
export function tupleKeyPitfall() {
  const visited = new Set<[number, number]>();
  visited.add([0, 0]);
  return visited.has([0, 0]); // false — a different array
}

// Fix: derive a primitive key. Keep the encoding unambiguous.
export type Point = readonly [x: number, y: number];
export const pointKey = ([x, y]: Point): string => `${x},${y}`;

export class PointSet {
  readonly #keys = new Set<string>();
  add(p: Point): this {
    this.#keys.add(pointKey(p));
    return this;
  }
  has(p: Point): boolean {
    return this.#keys.has(pointKey(p));
  }
  get size(): number {
    return this.#keys.size;
  }
}

// Or intern objects so equal inputs share one reference.
export function createInterner<T>(keyOf: (value: T) => string): (value: T) => T {
  const pool = new Map<string, T>();
  return (value) => {
    const k = keyOf(value);
    const existing = pool.get(k);
    if (existing !== undefined) return existing;
    pool.set(k, value);
    return value;
  };
}
