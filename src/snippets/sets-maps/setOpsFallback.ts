// Typed fallbacks for runtimes without ES2025 Set methods.
// They accept any ReadonlySet and never mutate their inputs.
export function union<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  return new Set([...a, ...b]);
}

export function intersection<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  return new Set([...small].filter((x) => large.has(x)));
}

export function difference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  return new Set([...a].filter((x) => !b.has(x)));
}

export function symmetricDifference<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): Set<T> {
  return union(difference(a, b), difference(b, a));
}

export function isSubsetOf<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean {
  if (a.size > b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

export const isSupersetOf = <T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean =>
  isSubsetOf(b, a);

export function isDisjointFrom<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean {
  for (const x of a) if (b.has(x)) return false;
  return true;
}
