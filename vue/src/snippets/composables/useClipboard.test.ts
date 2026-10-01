import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';
import { useClipboard } from './useClipboard';

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockReset().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});
afterEach(() => vi.useRealTimers());

describe('useClipboard', () => {
  it('copies, flags `copied`, and resets after the timeout (restarting on re-copy)', async () => {
    const scope = effectScope();
    const { copy, copied, isSupported } = scope.run(() => useClipboard(1000))!;
    expect(isSupported).toBe(true);

    await expect(copy('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(copied.value).toBe(true);

    vi.advanceTimersByTime(800);
    await copy('again');
    vi.advanceTimersByTime(800);
    expect(copied.value).toBe(true); // timer restarted
    vi.advanceTimersByTime(200);
    expect(copied.value).toBe(false);
    scope.stop();
  });

  it('returns false when the write is rejected', async () => {
    writeText.mockRejectedValueOnce(new DOMException('denied', 'NotAllowedError'));
    const scope = effectScope();
    const { copy, copied } = scope.run(() => useClipboard())!;
    await expect(copy('x')).resolves.toBe(false);
    expect(copied.value).toBe(false);
    scope.stop();
  });

  it('clears the pending timer when the scope is disposed', async () => {
    const scope = effectScope();
    const { copy } = scope.run(() => useClipboard())!;
    await copy('x');
    scope.stop();
    expect(vi.getTimerCount()).toBe(0);
  });
});
