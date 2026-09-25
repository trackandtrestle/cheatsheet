// Built-in: flat(depth). Default depth is 1; Infinity flattens fully.
export const once = [1, [2, [3, [4]]]].flat(); // [1, 2, [3, [4]]]
export const fully = [1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// Recursive type: the element type of an arbitrarily nested array.
export type Nested<T> = T | readonly Nested<T>[];

export function flattenDeep<T>(xs: readonly Nested<T>[]): T[] {
  const out: T[] = [];
  const walk = (v: Nested<T>): void => {
    if (Array.isArray(v)) for (const x of v as readonly Nested<T>[]) walk(x);
    else out.push(v as T);
  };
  for (const x of xs) walk(x);
  return out;
}

// Explicit depth with a manual stack (no recursion limit).
export function flattenDepth(xs: readonly unknown[], depth = 1): unknown[] {
  const stack: [unknown, number][] = xs.map((x) => [x, depth] as [unknown, number]).reverse();
  const out: unknown[] = [];
  let item: [unknown, number] | undefined;
  while ((item = stack.pop())) {
    const [v, d] = item;
    if (Array.isArray(v) && d > 0) for (let i = v.length - 1; i >= 0; i--) stack.push([v[i], d - 1]);
    else out.push(v);
  }
  return out;
}
