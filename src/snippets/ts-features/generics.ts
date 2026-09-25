// Constraint `K extends keyof T`: the return type follows the chosen key.
export function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

// Structural constraint: anything with a numeric length.
export function longest<T extends { length: number }>(a: T, b: T): T {
  return b.length > a.length ? b : a;
}

// Defaults: callers may omit type arguments; constraint + default combine.
export interface Result<TData = unknown, TError extends Error = Error> {
  data?: TData;
  error?: TError;
}

// `const` type parameter: infer literals without the caller writing `as const`.
export function defineRoles<const T extends readonly string[]>(roles: T): T {
  return roles;
}

// NoInfer: only `states` decides S; `initial` must be one of them.
export function createMachine<S extends string>(states: readonly S[], initial: NoInfer<S>) {
  let current: S = initial;
  return {
    get state() { return current; },
    go(next: S) { current = next; },
  };
}
