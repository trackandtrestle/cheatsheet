// A shared literal field (the discriminant) tags each variant.
export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Accepts only `never`: compiles only if every variant was handled.
export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}

export function describeState<T>(state: RequestState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Not started';
    case 'loading':
      return 'Loading…';
    case 'success':
      return `Loaded ${String(state.data)}`; // narrowed: `data` exists here
    case 'error':
      return `Failed: ${state.error.message}`;
    default:
      return assertNever(state); // add a variant -> compile error here
  }
}
