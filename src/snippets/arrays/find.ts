export interface Log {
  level: 'info' | 'error';
  msg: string;
}

// find / findLast return T | undefined — always handle the miss.
export function firstError(logs: Log[]): string {
  return logs.find((l) => l.level === 'error')?.msg ?? 'no errors';
}

// findLast searches from the end (ES2023) — no reverse() copy needed.
export const lastError = (logs: Log[]): Log | undefined =>
  logs.findLast((l) => l.level === 'error');

// findIndex / findLastIndex return -1 on a miss, not undefined.
export function replaceLastError(logs: Log[], msg: string): Log[] {
  const i = logs.findLastIndex((l) => l.level === 'error');
  return i === -1 ? logs : logs.with(i, { level: 'error', msg });
}

// A type-guard predicate narrows the result type.
type Shape = { kind: 'circle'; r: number } | { kind: 'square'; side: number };
export const firstCircle = (shapes: Shape[]) =>
  shapes.find((s): s is Extract<Shape, { kind: 'circle' }> => s.kind === 'circle');
