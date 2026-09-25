import { describe, expect, it } from 'vitest';
import { firstCircle, firstError, lastError, replaceLastError, type Log } from './find';

const logs: Log[] = [
  { level: 'info', msg: 'boot' },
  { level: 'error', msg: 'e1' },
  { level: 'error', msg: 'e2' },
];

describe('find family', () => {
  it('find returns the first match or undefined', () => {
    expect(firstError(logs)).toBe('e1');
    expect(firstError([])).toBe('no errors');
  });
  it('findLast searches from the end', () => {
    expect(lastError(logs)?.msg).toBe('e2');
  });
  it('findLastIndex returns -1 on miss', () => {
    expect(replaceLastError(logs, 'x')[2]?.msg).toBe('x');
    const infoOnly: Log[] = [{ level: 'info', msg: 'a' }];
    expect(replaceLastError(infoOnly, 'x')).toBe(infoOnly);
  });
  it('type guard narrows', () => {
    const c = firstCircle([{ kind: 'square', side: 1 }, { kind: 'circle', r: 2 }]);
    expect(c?.r).toBe(2);
  });
});
