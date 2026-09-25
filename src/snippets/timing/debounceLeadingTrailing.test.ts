import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounceLeadingTrailing } from './debounceLeadingTrailing';

describe('debounceLeadingTrailing', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires on the leading edge and once more after the burst', () => {
    const spy = vi.fn<(n: number) => void>();
    const d = debounceLeadingTrailing(spy, 200);
    d(1);
    d(2);
    d(3);
    expect(spy.mock.calls).toEqual([[1]]);
    vi.advanceTimersByTime(200);
    expect(spy.mock.calls).toEqual([[1], [3]]);
  });

  it('a single call fires only once (no duplicate trailing call)', () => {
    const spy = vi.fn();
    const d = debounceLeadingTrailing(spy, 200);
    d();
    vi.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
