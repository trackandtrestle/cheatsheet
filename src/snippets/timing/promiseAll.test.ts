import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadDashboard, loadDashboardSlow } from './promiseAll';

const after = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
const failAfter = (ms: number, message: string) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms));

describe('Promise.all', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('runs in parallel: total time is the slowest, not the sum', async () => {
    const done = vi.fn();
    void loadDashboard(() => after(300, { name: 'Ada' }), () => after(200, 3)).then(done);
    await vi.advanceTimersByTimeAsync(300);
    expect(done).toHaveBeenCalledWith('Ada has 3 items');
  });

  it('sequential awaits take the sum', async () => {
    const done = vi.fn();
    void loadDashboardSlow(() => after(300, { name: 'Ada' }), () => after(200, 3)).then(done);
    await vi.advanceTimersByTimeAsync(300);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(200);
    expect(done).toHaveBeenCalled();
  });

  it('fails fast on the first rejection, without waiting for the rest', async () => {
    const slowUser = vi.fn(() => after(5000, { name: 'Ada' }));
    const p = loadDashboard(slowUser, () => failAfter(100, 'count failed'));
    const assertion = expect(p).rejects.toThrow('count failed');
    await vi.advanceTimersByTimeAsync(100);
    await assertion;
    expect(vi.getTimerCount()).toBe(1); // the user request is still in flight
  });
});
