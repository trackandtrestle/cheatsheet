// `asserts condition`: if the function returns, the condition held.
export function assert(condition: unknown, message = 'Assertion failed'): asserts condition {
  if (!condition) throw new Error(message);
}

// `asserts value is T`: narrows the argument for the rest of the scope.
export function assertIsDefined<T>(value: T, name = 'value'): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${name} to be defined`);
  }
}

export function getRoot(doc: Document): HTMLElement {
  const el = doc.getElementById('root'); // HTMLElement | null
  assertIsDefined(el, '#root');
  return el; // HTMLElement — no `!` needed
}

export function parsePort(raw: string): number {
  const port = Number(raw);
  assert(Number.isInteger(port) && port > 0 && port < 65536, `Invalid port: ${raw}`);
  return port;
}

// Arrow-function asserters need an explicit type annotation to narrow.
export const assertString: (v: unknown) => asserts v is string = (v) => {
  if (typeof v !== 'string') throw new TypeError('Expected a string');
};
