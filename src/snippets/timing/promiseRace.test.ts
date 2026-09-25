import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { raceAndAbort } from './promiseRace';

const after = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

describe('Promise.race', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('settles with whichever settles first, even a rejection', async () => {
    const p = Promise.race([after(100, 'slow ok'), Promise.reject(new Error('fast fail'))]);
    await expect(p).rejects.toThrow('fast fail');
  });

  it('does not cancel the loser on its own', async () => {
    const loser = vi.fn();
    const p = Promise.race([after(10, 'win'), after(100, 'lose').then(loser)]);
    await vi.advanceTimersByTimeAsync(10);
    await expect(p).resolves.toBe('win');
    expect(loser).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(90);
    expect(loser).toHaveBeenCalled(); // still ran to completion
  });

  it('raceAndAbort aborts the losers once there is a winner', async () => {
    const signals: AbortSignal[] = [];
    const task = (ms: number) => (signal: AbortSignal) => {
      signals.push(signal);
      return after(ms, ms);
    };
    const p = raceAndAbort([task(50), task(500)]);
    await vi.advanceTimersByTimeAsync(50);
    await expect(p).resolves.toBe(50);
    expect(signals.every((s) => s.aborted)).toBe(true);
  });
});
