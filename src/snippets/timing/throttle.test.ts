import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { throttle } from './throttle';

describe('throttle (leading + trailing)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires at most once per window, leading and trailing', () => {
    const spy = vi.fn<(n: number) => void>();
    const t = throttle(spy, 100);
    // a call every 20ms for 250ms
    for (let i = 0; i <= 12; i++) {
      t(i);
      vi.advanceTimersByTime(20);
    }
    vi.advanceTimersByTime(200);
    // leading at t=0; trailing at t=100 (latest arg 4), t=200 (arg 9), t=300 (last arg 12)
    expect(spy.mock.calls.map(([n]) => n)).toEqual([0, 4, 9, 12]);
  });

  it('a single call fires once', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t(1);
    vi.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('cancel() drops the trailing call', () => {
    const spy = vi.fn();
    const t = throttle(spy, 100);
    t();
    t();
    t.cancel();
    vi.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
