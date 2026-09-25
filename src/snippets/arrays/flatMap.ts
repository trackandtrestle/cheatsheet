// flatMap = map + flat(1). Return [] to drop an item, [a, b] to expand it.
export const words = (lines: string[]): string[] =>
  lines.flatMap((line) => line.split(/\s+/).filter(Boolean));

// Filter + map in one pass, and TypeScript infers the narrowed type.
export const parseInts = (raw: string[]): number[] =>
  raw.flatMap((s) => {
    const n = Number.parseInt(s, 10);
    return Number.isNaN(n) ? [] : [n];
  });

// Only flattens ONE level: nested arrays in the result stay nested.
export const oneLevel = [1, 2].flatMap((n) => [[n, n * 10]]); // [[1,10],[2,20]]
