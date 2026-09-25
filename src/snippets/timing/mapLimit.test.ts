import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mapLimit } from './mapLimit';

describe('mapLimit', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('never exceeds the limit and preserves input order', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const durations = [300, 100, 200, 50, 10, 250];
    const p = mapLimit(durations, 2, async (ms, i) => {
      maxInFlight = Math.max(maxInFlight, ++inFlight);
      await new Promise((r) => setTimeout(r, ms));
      inFlight--;
      return `#${i}:${ms}`;
    });
    await vi.runAllTimersAsync();
    await expect(p).resolves.toEqual(durations.map((ms, i) => `#${i}:${ms}`));
    expect(maxInFlight).toBe(2);
  });

  it('starts the next item as soon as a slot frees up', async () => {
    const started: number[] = [];
    void mapLimit([100, 10, 10], 2, async (ms, i) => {
      started.push(i);
      await new Promise((r) => setTimeout(r, ms));
    });
    expect(started).toEqual([0, 1]);
    await vi.advanceTimersByTimeAsync(10);
    expect(started).toEqual([0, 1, 2]); // didn't wait for the slow item 0
  });

  it('handles an empty list', async () => {
    await expect(mapLimit([], 3, async (x: number) => x)).resolves.toEqual([]);
  });
});
