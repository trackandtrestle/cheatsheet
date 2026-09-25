import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { memoizeAsync } from './memoizeAsync';

describe('memoizeAsync', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('dedupes concurrent calls into one request', async () => {
    const fetchUser = vi.fn(async (id: number) => ({ id }));
    const getUser = memoizeAsync(fetchUser, 1000);
    const [a, b] = await Promise.all([getUser(1), getUser(1)]);
    expect(a).toBe(b);
    expect(fetchUser).toHaveBeenCalledTimes(1);
  });

  it('refetches after the TTL expires', async () => {
    const fetchUser = vi.fn(async (id: number) => ({ id }));
    const getUser = memoizeAsync(fetchUser, 1000);
    await getUser(1);
    vi.advanceTimersByTime(999);
    await getUser(1);
    expect(fetchUser).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    await getUser(1);
    expect(fetchUser).toHaveBeenCalledTimes(2);
  });

  it('evicts rejections so the next call retries', async () => {
    const fetchUser = vi.fn<(id: number) => Promise<string>>()
      .mockRejectedValueOnce(new Error('network')).mockResolvedValue('ok');
    const getUser = memoizeAsync(fetchUser, 60_000);
    await expect(getUser(1)).rejects.toThrow('network');
    await expect(getUser(1)).resolves.toBe('ok');
    expect(fetchUser).toHaveBeenCalledTimes(2);
  });
});
