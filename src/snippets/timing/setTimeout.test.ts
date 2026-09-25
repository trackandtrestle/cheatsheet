import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { orderDemo, scheduleGreeting } from './setTimeout';

describe('setTimeout / clearTimeout', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires after the delay', () => {
    const spy = vi.fn();
    scheduleGreeting(spy, 1000);
    vi.advanceTimersByTime(999);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('can be cancelled', () => {
    const spy = vi.fn();
    const cancel = scheduleGreeting(spy, 1000);
    cancel();
    vi.advanceTimersByTime(5000);
    expect(spy).not.toHaveBeenCalled();
  });

  it('runs sync, then microtasks, then timers', async () => {
    const log: string[] = [];
    orderDemo(log);
    expect(log).toEqual(['sync']);
    await Promise.resolve();
    expect(log).toEqual(['sync', 'microtask', 'promise']);
    vi.runAllTimers();
    expect(log).toEqual(['sync', 'microtask', 'promise', 'timeout']);
  });
});
