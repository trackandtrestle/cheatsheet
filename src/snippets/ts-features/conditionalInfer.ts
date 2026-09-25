// T extends U ? X : Y — a ternary at the type level.
export type IsArray<T> = T extends readonly unknown[] ? true : false;

// `infer` captures part of the matched type into a new type variable.
export type ElementOf<T> = T extends readonly (infer E)[] ? E : never;

// Recursive: unwrap nested promises (what Awaited does).
export type UnwrapPromise<T> = T extends PromiseLike<infer V> ? UnwrapPromise<V> : T;

// Pattern-match tuples: first element and the rest.
export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]] ? H : never;
export type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : [];

export type FirstArg<F extends (...args: never[]) => unknown> = Head<Parameters<F>>;

// `infer X extends C` constrains the capture (e.g. parse a numeric string).
export type ToNumber<S extends string> = S extends `${infer N extends number}` ? N : never;

// Extract a component's props from its type.
export type PropsOf<C> = C extends (props: infer P) => unknown ? P : never;
