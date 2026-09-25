import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const setup = (initial: (q: string) => void) =>
    renderHook(({ cb }) => useDebouncedCallback(cb, 300), { initialProps: { cb: initial } });

  it('keeps a stable identity across renders with new callbacks', () => {
    const { result, rerender } = setup(vi.fn());
    const first = result.current;
    rerender({ cb: vi.fn() });
    expect(result.current).toBe(first);
  });

  it('calls the latest callback with the last arguments', () => {
    const stale = vi.fn();
    const fresh = vi.fn();
    const { result, rerender } = setup(stale);
    act(() => {
      result.current('a');
      result.current('ab');
    });
    rerender({ cb: fresh }); // new closure arrives while the timer is pending
    act(() => vi.advanceTimersByTime(300));
    expect(stale).not.toHaveBeenCalled();
    expect(fresh).toHaveBeenCalledExactlyOnceWith('ab');
  });

  it('cancel() and unmount drop the pending call', () => {
    const cb = vi.fn();
    const { result, unmount } = setup(cb);
    act(() => result.current('x'));
    act(() => result.current.cancel());
    act(() => vi.advanceTimersByTime(300));
    act(() => result.current('y'));
    unmount();
    vi.advanceTimersByTime(300);
    expect(cb).not.toHaveBeenCalled();
  });
});
