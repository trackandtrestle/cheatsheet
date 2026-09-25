type Entity = 'user' | 'post';
type Action = 'created' | 'deleted';

// Unions inside a template literal expand to every combination.
export type EventName = `${Entity}:${Action}`; // 'user:created' | 'user:deleted' | ...

// Intrinsics: Uppercase, Lowercase, Capitalize, Uncapitalize.
export type HandlerName<E extends string> = `on${Capitalize<E>}`;
export type EnvKey<K extends string> = `APP_${Uppercase<K>}`;

// Derive props from event names: { onOpen: () => void; onClose: () => void }
export type Handlers<E extends string> = { [K in E as HandlerName<K>]: () => void };

// `infer` inside a template parses strings at the type level.
export type RouteParams<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParams<Rest>
    : P extends `${string}:${infer Param}`
      ? Param
      : never;

export function buildPath<P extends string>(pattern: P, params: Record<RouteParams<P>, string>) {
  const values: Record<string, string> = params;
  return pattern.replace(/:(\w+)/g, (_, key: string) => encodeURIComponent(values[key] ?? ''));
}

export function eventName<E extends Entity, A extends Action>(entity: E, action: A) {
  return `${entity}:${action}` as const; // typed as `${E}:${A}`, not string
}
