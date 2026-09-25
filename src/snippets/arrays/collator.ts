// < and > compare code units: 'Z' < 'a', 'é' > 'z', 'file10' < 'file2'.
export const naive = (xs: string[]): string[] => xs.toSorted();

// localeCompare handles accents/case per locale.
export const localeSorted = (xs: string[]): string[] =>
  xs.toSorted((a, b) => a.localeCompare(b, 'en'));

// Intl.Collator: build ONCE and reuse (much faster than localeCompare in a loop).
// numeric: 'file2' < 'file10'. sensitivity 'base': a = A = á.
const natural = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
export const naturalSort = (xs: string[]): string[] => xs.toSorted(natural.compare);

// sensitivity also powers case/accent-insensitive equality.
export const looseEquals = (a: string, b: string): boolean => natural.compare(a, b) === 0;
