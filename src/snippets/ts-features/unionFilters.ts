export type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'square'; size: number }
  | { kind: 'rect'; w: number; h: number };

// Extract / Exclude filter union MEMBERS (Pick / Omit filter object KEYS).
export type Circle = Extract<Shape, { kind: 'circle' }>;
export type Polygon = Exclude<Shape, { kind: 'circle' }>;
export type Primitive = Extract<string | number | Date, string | number>;

export function isPolygon(shape: Shape): shape is Polygon {
  return shape.kind !== 'circle';
}

// NonNullable removes null and undefined.
export function compact<T>(items: readonly T[]): NonNullable<T>[] {
  return items.filter((x): x is NonNullable<T> => x != null);
}
