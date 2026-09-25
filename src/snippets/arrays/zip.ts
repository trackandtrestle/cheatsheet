// zip two arrays into typed tuples, truncating to the shorter.
export function zip<A, B>(as: readonly A[], bs: readonly B[]): [A, B][] {
  const n = Math.min(as.length, bs.length);
  const out: [A, B][] = [];
  for (let i = 0; i < n; i++) out.push([as[i] as A, bs[i] as B]);
  return out;
}

// Variadic: zipAll([1,2], ['a','b'], [true,false]) -> [number, string, boolean][]
type Elements<T extends readonly unknown[][]> = { [K in keyof T]: T[K][number] };

export function zipAll<T extends unknown[][]>(...arrays: T): Elements<T>[] {
  const n = Math.min(...arrays.map((a) => a.length));
  return Array.from({ length: n }, (_, i) => arrays.map((a) => a[i]) as Elements<T>);
}

// unzip: inverse of zip.
export const unzip = <A, B>(pairs: readonly [A, B][]): [A[], B[]] => [
  pairs.map(([a]) => a),
  pairs.map(([, b]) => b),
];
