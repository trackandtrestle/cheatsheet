// includes uses SameValueZero: finds NaN. indexOf uses === : does not.
export const hasNaNIncludes = (xs: number[]): boolean => xs.includes(Number.NaN);
export const hasNaNIndexOf = (xs: number[]): boolean => xs.indexOf(Number.NaN) !== -1;

// Objects compare by reference, not by shape.
export const hasPoint = (pts: { x: number }[], p: { x: number }): boolean => pts.includes(p);

// Narrowing a wide string against a readonly tuple: includes() won't accept
// `string` for a `'a' | 'b'` array, so widen the array, then guard.
const STATUSES = ['draft', 'published'] as const;
export type Status = (typeof STATUSES)[number];
export function isStatus(s: string): s is Status {
  return (STATUSES as readonly string[]).includes(s);
}
