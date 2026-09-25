import { describe, expect, it, vi } from 'vitest';
import { StaleError, takeLatest } from './takeLatest';

describe('takeLatest', () => {
  it('delivers only the latest result, even if an older one resolves later', async () => {
    const pending = new Map<string, PromiseWithResolvers<string>>();
    const signals: AbortSignal[] = [];
    const search = takeLatest((signal: AbortSignal, q: string) => {
      signals.push(signal);
      const d = Promise.withResolvers<string>();
      pending.set(q, d);
      return d.promise; // this fake ignores the signal, to prove the guard alone works
    });

    const first = search('a');
    const second = search('ab');
    expect(signals[0]?.aborted).toBe(true); // older request was told to stop

    pending.get('ab')?.resolve('results for ab');
    pending.get('a')?.resolve('results for a'); // arrives late: out of order
    await expect(second).resolves.toBe('results for ab');
    await expect(first).rejects.toBeInstanceOf(StaleError);
  });

  it('propagates errors from the latest call only', async () => {
    const fail = vi.fn(async () => {
      throw new Error('boom');
    });
    const run = takeLatest(fail);
    const older = run();
    const latest = run();
    await expect(older).rejects.toBeInstanceOf(StaleError);
    await expect(latest).rejects.toThrow('boom');
  });
});
