// some: true if ANY item matches (stops at the first hit).
export const hasAdmin = (roles: string[]): boolean => roles.some((r) => r === 'admin');

// every: true if ALL items match (stops at the first miss).
export const allPositive = (xs: number[]): boolean => xs.every((x) => x > 0);

// Vacuous truth: [].every(...) is true, [].some(...) is false.
export const canSubmit = (fields: { valid: boolean }[]): boolean =>
  fields.length > 0 && fields.every((f) => f.valid);

// every() with a type guard narrows the whole array.
export function sumIfAllNumbers(xs: unknown[]): number | null {
  if (!xs.every((x): x is number => typeof x === 'number')) return null;
  return xs.reduce((a, b) => a + b, 0); // xs: number[] here
}
