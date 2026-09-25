// Split into groups of `size`; the last chunk may be shorter.
export function chunk<T>(xs: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) throw new RangeError('size must be a positive integer');
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += size) out.push(xs.slice(i, i + size));
  return out;
}

// One-liner alternative with Array.from.
export const chunkFrom = <T,>(xs: readonly T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(xs.length / size) }, (_, i) =>
    xs.slice(i * size, i * size + size),
  );
