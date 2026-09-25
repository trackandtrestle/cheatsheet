import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CancelledError, makeCancellable } from './cancellablePromise';

const after = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

describe('cancellable promise', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves normally if not cancelled', async () => {
    const { promise } = makeCancellable(after(100, 'data'));
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBe('data');
  });

  it('rejects with CancelledError on cancel, but the work still completes', async () => {
    const workDone = vi.fn();
    const { promise, cancel } = makeCancellable(after(100, 'data').then(workDone));
    cancel();
    await expect(promise).rejects.toBeInstanceOf(CancelledError);
    await vi.advanceTimersByTimeAsync(100);
    expect(workDone).toHaveBeenCalled();
  });

  it('cancel after settling is a no-op', async () => {
    const { promise, cancel } = makeCancellable(Promise.resolve(1));
    await expect(promise).resolves.toBe(1);
    cancel();
    await expect(promise).resolves.toBe(1);
  });
});
