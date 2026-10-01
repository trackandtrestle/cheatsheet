import { afterEach, describe, expect, it } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { watchSources } from './watchSources';

describe('watch sources', () => {
  let scope = effectScope();
  afterEach(() => scope.stop());

  function setup() {
    scope = effectScope();
    const log: string[] = [];
    const api = scope.run(() => watchSources((m) => log.push(m)));
    if (!api) throw new Error('scope inactive');
    return { log, ...api };
  }

  it('ref, getter and array sources', async () => {
    const { log, count, user } = setup();
    count.value++;
    user.name = 'Grace';
    await nextTick(); // default flush batches both changes into one run per watcher
    expect(log.toSorted()).toEqual(['array 1 Grace', 'getter Grace', 'reactive (deep)', 'ref 0->1']);
  });

  it('reactive source is deep, object getter is shallow', async () => {
    const { log, user } = setup();
    user.address.city = 'Paris';
    await nextTick();
    expect(log).toEqual(['reactive (deep)']);

    log.length = 0;
    user.address = { city: 'Rome' };
    await nextTick();
    expect(log.toSorted()).toEqual(['getter (shallow)', 'reactive (deep)']);
  });
});
