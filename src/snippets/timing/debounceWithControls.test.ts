import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounceWithControls } from './debounceWithControls';

describe('debounceWithControls', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('pending() reflects the scheduled call', () => {
    const d = debounceWithControls(vi.fn(), 100);
    expect(d.pending()).toBe(false);
    d();
    expect(d.pending()).toBe(true);
    vi.advanceTimersByTime(100);
    expect(d.pending()).toBe(false);
  });

  it('cancel() drops the pending call', () => {
    const spy = vi.fn();
    const d = debounceWithControls(spy, 100);
    d();
    d.cancel();
    vi.advanceTimersByTime(500);
    expect(spy).not.toHaveBeenCalled();
    expect(d.pending()).toBe(false);
  });

  it('flush() runs the pending call now, exactly once', () => {
    const spy = vi.fn<(s: string) => void>();
    const d = debounceWithControls(spy, 100);
    d('draft');
    d.flush();
    expect(spy).toHaveBeenCalledWith('draft');
    vi.advanceTimersByTime(500);
    d.flush(); // nothing pending -> no-op
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
