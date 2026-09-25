import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires once after the delay', () => {
    const cb = vi.fn();
    renderHook(() => useTimeout(cb, 1000));
    act(() => vi.advanceTimersByTime(5000));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('reset() restarts the countdown, clear() cancels it', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useTimeout(cb, 1000));
    act(() => vi.advanceTimersByTime(900));
    act(() => result.current.reset());
    act(() => vi.advanceTimersByTime(900));
    expect(cb).not.toHaveBeenCalled();
    act(() => result.current.clear());
    act(() => vi.advanceTimersByTime(5000));
    expect(cb).not.toHaveBeenCalled();
  });

  it('null disables it; unmount cleans up', () => {
    const cb = vi.fn();
    const { rerender, unmount } = renderHook(({ delay }) => useTimeout(cb, delay), {
      initialProps: { delay: null as number | null },
    });
    act(() => vi.advanceTimersByTime(5000));
    expect(cb).not.toHaveBeenCalled();
    rerender({ delay: 1000 });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
