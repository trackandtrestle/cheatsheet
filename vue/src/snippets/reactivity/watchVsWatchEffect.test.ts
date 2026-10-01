import { afterEach, describe, expect, it } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { useSearchLog } from './watchVsWatchEffect';

describe('watch vs watchEffect', () => {
  const scope = effectScope();
  afterEach(() => scope.stop());

  it('watchEffect runs eagerly and tracks everything it reads; watch is lazy and explicit', async () => {
    const log: string[] = [];
    const api = scope.run(() => useSearchLog((m) => log.push(m)));
    if (!api) throw new Error('scope inactive');
    expect(log).toEqual(['effect: "" page 1']); // watch has not run

    api.page.value = 2;
    await nextTick();
    expect(log).toEqual(['effect: "" page 1', 'effect: "" page 2']); // watch ignores page

    log.length = 0;
    api.query.value = 'vue';
    await nextTick();
    expect(log).toEqual(['effect: "vue" page 2', 'watch: "" -> "vue"']);
  });
});
