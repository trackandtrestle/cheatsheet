import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('updates at most once per interval, delivering the latest value', () => {
    const { result, rerender } = renderHook(({ v }) => useThrottle(v, 100), {
      initialProps: { v: 0 },
    });
    rerender({ v: 1 }); // mount counts as an update, so this waits for the window
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(50));
    rerender({ v: 2 });
    rerender({ v: 3 });
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(50));
    expect(result.current).toBe(3); // trailing edge delivers the latest value
    act(() => vi.advanceTimersByTime(200));
    rerender({ v: 4 });
    expect(result.current).toBe(4); // quiet period elapsed: leading edge is immediate
  });
});
