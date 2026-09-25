import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { every, everyAligned } from './setInterval';

describe('setInterval / clearInterval', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('ticks every interval until stopped', () => {
    const tick = vi.fn();
    const stop = every(100, tick);
    vi.advanceTimersByTime(350);
    expect(tick.mock.calls).toEqual([[1], [2], [3]]);
    stop();
    vi.advanceTimersByTime(1000);
    expect(tick).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('aligned ticker subtracts time spent in the callback from the next delay', () => {
    const at: number[] = [];
    const stop = everyAligned(100, () => {
      at.push(Date.now());
      vi.setSystemTime(Date.now() + 30); // simulate 30 ms of work
    });
    const t0 = Date.now();
    vi.advanceTimersByTime(100);
    expect(at).toEqual([t0 + 100]);
    // Next tick is due at t0+200; the clock already reads t0+130, so it waits 70 ms.
    vi.advanceTimersByTime(69);
    expect(at).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(at).toEqual([t0 + 100, t0 + 200]);
    stop();
    expect(vi.getTimerCount()).toBe(0);
  });
});
