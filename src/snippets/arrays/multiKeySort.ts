export interface Person {
  last: string;
  first: string;
  age: number;
}

// Chain comparisons with ||: the first non-zero result wins.
export const byLastFirstAgeDesc = (a: Person, b: Person): number =>
  a.last.localeCompare(b.last) || a.first.localeCompare(b.first) || b.age - a.age;

// Reusable: compose comparators.
export type Comparator<T> = (a: T, b: T) => number;

export const by =
  <T, K extends string | number>(key: (t: T) => K, dir: 1 | -1 = 1): Comparator<T> =>
  (a, b) => {
    const ka = key(a);
    const kb = key(b);
    return ka < kb ? -dir : ka > kb ? dir : 0;
  };

export const thenBy =
  <T,>(...cmps: Comparator<T>[]): Comparator<T> =>
  (a, b) => {
    for (const cmp of cmps) {
      const r = cmp(a, b);
      if (r !== 0) return r;
    }
    return 0;
  };
