import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onScrollFrame, rafThrottle } from './rafThrottle';

describe('rafThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });
  afterEach(() => vi.useRealTimers());

  it('coalesces many calls into one per frame with the latest args', () => {
    const spy = vi.fn<(x: number) => void>();
    const move = rafThrottle(spy);
    move(1);
    move(2);
    move(3);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersToNextFrame();
    expect(spy.mock.calls).toEqual([[3]]);
    move(4);
    vi.advanceTimersToNextFrame();
    expect(spy.mock.calls).toEqual([[3], [4]]);
  });

  it('onScrollFrame reports once per frame and cleans up', () => {
    const spy = vi.fn();
    const stop = onScrollFrame(spy);
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersToNextFrame();
    expect(spy).toHaveBeenCalledTimes(1);
    stop();
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersToNextFrame();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
