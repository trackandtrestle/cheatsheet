import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounceLeading } from './debounceLeading';

describe('debounceLeading', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires immediately, then ignores the rest of the burst', () => {
    const spy = vi.fn<(n: number) => void>();
    const submit = debounceLeading(spy, 300);
    submit(1);
    expect(spy).toHaveBeenCalledWith(1);
    for (let i = 2; i <= 5; i++) {
      vi.advanceTimersByTime(100);
      submit(i);
    }
    vi.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls during the burst extend the quiet period', () => {
    const spy = vi.fn();
    const d = debounceLeading(spy, 300);
    d();
    vi.advanceTimersByTime(250);
    d(); // extends until t=550
    vi.advanceTimersByTime(250); // t=500
    d(); // still inside burst -> ignored, extends to 800
    expect(spy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(300);
    d(); // quiet period elapsed -> fires
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
