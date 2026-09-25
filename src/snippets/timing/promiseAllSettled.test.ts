import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { settleAll } from './promiseAllSettled';

const after = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

describe('Promise.allSettled', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('waits for all tasks even after one fails, and never rejects', async () => {
    const done = vi.fn();
    void settleAll([
      () => after(100, 'a'),
      () => Promise.reject(new Error('b failed')),
      () => after(300, 'c'),
    ]).then(done);
    await vi.advanceTimersByTimeAsync(299);
    expect(done).not.toHaveBeenCalled(); // unlike Promise.all, a rejection doesn't short-circuit
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalledWith({ values: ['a', 'c'], errors: [new Error('b failed')] });
  });
});
