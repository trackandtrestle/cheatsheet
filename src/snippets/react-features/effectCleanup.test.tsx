import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useNow, useOnline } from './effectCleanup';

describe('useEffect cleanup', () => {
  beforeEach(() => vi.useFakeTimers({ now: 0 }));
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('StrictMode mounts, cleans up and re-mounts: still exactly one interval', () => {
    const { result, unmount } = renderHook(() => useNow(1000), { wrapper: StrictMode });
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current).toBe(3000);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('changing deps clears the old interval before starting a new one', () => {
    const { rerender } = renderHook(({ ms }) => useNow(ms), { initialProps: { ms: 1000 } });
    rerender({ ms: 500 });
    expect(vi.getTimerCount()).toBe(1);
  });

  it('subscribes and unsubscribes the same listener', () => {
    const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const remove = vi.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useOnline());
    expect(result.current).toBe(true);

    onLine.mockReturnValue(false);
    act(() => void window.dispatchEvent(new Event('offline')));
    expect(result.current).toBe(false);

    unmount();
    const removed = remove.mock.calls.map(([type]) => type);
    expect(removed).toEqual(expect.arrayContaining(['online', 'offline']));
  });
});
