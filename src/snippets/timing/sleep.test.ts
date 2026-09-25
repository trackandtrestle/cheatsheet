import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pollUntil, sleep } from './sleep';

describe('sleep(ms, signal?)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves after the delay', async () => {
    const done = vi.fn();
    void sleep(500).then(done);
    await vi.advanceTimersByTimeAsync(499);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalled();
  });

  it('rejects with the abort reason and clears its timer', async () => {
    const controller = new AbortController();
    const p = sleep(500, controller.signal);
    controller.abort(new Error('stop'));
    await expect(p).rejects.toThrow('stop');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects immediately if already aborted', async () => {
    await expect(sleep(10, AbortSignal.abort('gone'))).rejects.toBe('gone');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('advanceTimersByTimeAsync flushes the promise chain between timers', async () => {
    const check = vi.fn<() => Promise<boolean>>()
      .mockResolvedValueOnce(false).mockResolvedValueOnce(false).mockResolvedValue(true);
    const done = vi.fn();
    void pollUntil(check, 100).then(done);
    vi.advanceTimersByTime(1000); // sync: next sleep isn't scheduled yet, so nothing happens
    expect(check).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(200);
    expect(check).toHaveBeenCalledTimes(3);
    expect(done).toHaveBeenCalled();
  });
});
