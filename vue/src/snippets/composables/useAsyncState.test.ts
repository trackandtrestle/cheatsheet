import { describe, expect, it } from 'vitest';
import { effectScope } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { useAsyncState } from './useAsyncState';

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

describe('useAsyncState', () => {
  it('tracks loading -> data and loading -> error', async () => {
    const scope = effectScope();
    const s = scope.run(() => useAsyncState(async (n: number) => {
      if (n < 0) throw new Error('negative');
      return n * 2;
    }))!;
    const p = s.execute(21);
    expect(s.loading.value).toBe(true);
    await expect(p).resolves.toBe(42);
    expect(s.data.value).toBe(42);
    expect(s.loading.value).toBe(false);

    await s.execute(-1);
    expect(s.error.value?.message).toBe('negative');
    expect(s.data.value).toBe(42); // previous data kept
    scope.stop();
  });

  it('ignores a slow earlier call that resolves after a newer one', async () => {
    const slow = deferred<string>();
    const fast = deferred<string>();
    const s = useAsyncState((d: { promise: Promise<string> }) => d.promise);
    void s.execute(slow);
    void s.execute(fast);
    fast.resolve('new');
    await flushPromises();
    slow.resolve('old');
    await flushPromises();
    expect(s.data.value).toBe('new');
    expect(s.loading.value).toBe(false);
  });
});
