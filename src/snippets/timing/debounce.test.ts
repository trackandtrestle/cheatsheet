import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce (trailing)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires once, wait ms after the last call, with the last args', () => {
    const spy = vi.fn<(q: string) => void>();
    const search = debounce(spy, 300);
    search('a');
    vi.advanceTimersByTime(200);
    search('ab');
    vi.advanceTimersByTime(200);
    search('abc');
    vi.advanceTimersByTime(299);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('abc');
  });

  it('fires again for a separate burst', () => {
    const spy = vi.fn();
    const d = debounce(spy, 100);
    d();
    vi.advanceTimersByTime(100);
    d();
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
