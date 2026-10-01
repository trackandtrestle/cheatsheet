import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createTicker } from './effectScope';

describe('effectScope', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('disposes watchers and intervals together', async () => {
    const onTick = vi.fn();
    const { count, doubled, dispose } = createTicker(onTick, 100);

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(count.value).toBe(2);
    expect(doubled.value).toBe(4);
    expect(onTick).toHaveBeenCalledTimes(1); // batched: both ticks flushed together

    dispose();
    vi.advanceTimersByTime(500);
    await nextTick();
    expect(count.value).toBe(2); // interval cleared
    count.value = 10;
    await nextTick();
    expect(onTick).toHaveBeenCalledTimes(1); // watcher stopped
  });
});
