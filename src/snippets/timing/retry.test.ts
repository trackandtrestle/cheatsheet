import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isTransient, retry } from './retry';

const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });

describe('retry with exponential backoff', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('waits 200, 400, 800 ms between attempts, then succeeds', async () => {
    const task = vi.fn<(attempt: number) => Promise<string>>()
      .mockRejectedValueOnce(new Error('1')).mockRejectedValueOnce(new Error('2'))
      .mockRejectedValueOnce(new Error('3')).mockResolvedValue('ok');
    const p = retry(task, { jitter: false });
    for (const [wait, calls] of [[0, 1], [200, 2], [400, 3], [800, 4]] as const) {
      await vi.advanceTimersByTimeAsync(wait);
      expect(task).toHaveBeenCalledTimes(calls);
    }
    await expect(p).resolves.toBe('ok');
  });

  it('gives up after `retries` and rethrows the last error', async () => {
    const task = vi.fn((attempt: number) => Promise.reject(new Error(`fail ${attempt}`)));
    const p = retry(task, { retries: 2, jitter: false });
    const assertion = expect(p).rejects.toThrow('fail 2');
    await vi.advanceTimersByTimeAsync(200 + 400);
    await assertion;
    expect(task).toHaveBeenCalledTimes(3);
  });

  it('jitter randomises the delay within [0, backoff)', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const task = vi.fn<() => Promise<string>>().mockRejectedValueOnce(new Error('x')).mockResolvedValue('ok');
    const p = retry(task, { baseMs: 1000 });
    await vi.advanceTimersByTimeAsync(499);
    expect(task).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(p).resolves.toBe('ok');
  });

  it('shouldRetry stops immediately on permanent errors', async () => {
    const task = vi.fn(() => Promise.reject(httpError(404)));
    await expect(retry(task, { shouldRetry: isTransient })).rejects.toThrow('HTTP 404');
    expect(task).toHaveBeenCalledTimes(1);
    expect(isTransient(httpError(503))).toBe(true);
    expect(isTransient(new TypeError('Failed to fetch'))).toBe(true);
  });
});
