// A conditional on a *naked* type parameter distributes over unions.
export type ToArray<T> = T extends unknown ? T[] : never;
// ToArray<string | number> -> string[] | number[]

// Wrapping both sides in [] turns distribution off.
export type ToArrayWhole<T> = [T] extends [unknown] ? T[] : never;
// ToArrayWhole<string | number> -> (string | number)[]

// Exclude is just a distributive conditional.
export type MyExclude<T, U> = T extends U ? never : T;

// never is the empty union: a distributive check on it yields never.
export type IsNeverBroken<T> = T extends never ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;

// Omit is NOT distributive: on a union it keeps only the shared keys.
export type Shape =
  | { id: string; kind: 'circle'; r: number }
  | { id: string; kind: 'square'; size: number };

export type BrokenShapeInput = Omit<Shape, 'id'>; // { kind: 'circle' | 'square' }

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type ShapeInput = DistributiveOmit<Shape, 'id'>;

export function createShape(input: ShapeInput): Shape {
  return { ...input, id: crypto.randomUUID() };
}
