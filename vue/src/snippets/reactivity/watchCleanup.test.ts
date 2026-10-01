import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { useUser } from './watchCleanup';

function controllable() {
  const calls: { id: number; signal: AbortSignal; resolve: (v: string) => void }[] = [];
  const fetchUser = (id: number, signal: AbortSignal) =>
    new Promise<string>((resolve) => calls.push({ id, signal, resolve }));
  return { calls, fetchUser };
}

describe('onWatcherCleanup', () => {
  it('aborts the previous run and ignores its late response', async () => {
    const { calls, fetchUser } = controllable();
    const { id, name } = useUser(fetchUser);
    id.value = 2;
    await nextTick();

    expect(calls.map((c) => c.id)).toEqual([1, 2]);
    expect(calls[0]?.signal.aborted).toBe(true);

    calls[1]?.resolve('Grace');
    calls[0]?.resolve('Ada'); // arrives last, but is stale
    await flushPromises();
    expect(name.value).toBe('Grace');
  });

  it('stopping the watcher runs the cleanup', () => {
    const { calls, fetchUser } = controllable();
    const { stop } = useUser(fetchUser);
    stop();
    expect(calls[0]?.signal.aborted).toBe(true);
  });
});
