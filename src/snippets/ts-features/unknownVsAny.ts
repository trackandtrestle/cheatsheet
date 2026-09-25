// ⚠ Deliberate `any` for contrast: it switches the type checker OFF.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsafeLength(value: any): number {
  return value.length; // compiles for a number too -> returns undefined
}

// unknown: accepts anything, but you must narrow before using it.
export function safeLength(value: unknown): number {
  if (typeof value === 'string' || Array.isArray(value)) return value.length;
  return 0;
}

export interface Config {
  port: number;
  host: string;
}

// JSON.parse returns any: pin it to unknown immediately, then validate.
export function parseConfig(json: string): Config {
  const data: unknown = JSON.parse(json);
  if (
    typeof data === 'object' &&
    data !== null &&
    'port' in data &&
    typeof data.port === 'number' &&
    'host' in data &&
    typeof data.host === 'string'
  ) {
    return { port: data.port, host: data.host };
  }
  throw new TypeError('Invalid config');
}
