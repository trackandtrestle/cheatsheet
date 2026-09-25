import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TimeoutError, withTimeout } from './withTimeout';

const after = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

describe('withTimeout', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves with the value and clears its timer', async () => {
    const p = withTimeout(after(100, 'ok'), 1000);
    await vi.advanceTimersByTimeAsync(100);
    await expect(p).resolves.toBe('ok');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects with a TimeoutError when too slow', async () => {
    const p = withTimeout(after(5000, 'late'), 1000);
    const assertion = expect(p).rejects.toBeInstanceOf(TimeoutError);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
    await expect(p).rejects.toMatchObject({ name: 'TimeoutError', ms: 1000 });
  });

  it('passes through the original rejection', async () => {
    await expect(withTimeout(Promise.reject(new Error('boom')), 1000)).rejects.toThrow('boom');
    expect(vi.getTimerCount()).toBe(0);
  });
});
