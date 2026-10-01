import { afterEach, describe, expect, it } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { watchOptions } from './watchOptions';

describe('watch options', () => {
  const scope = effectScope();
  afterEach(() => scope.stop());

  it('deep, deep: 1, immediate and once', async () => {
    const log: string[] = [];
    const settings = scope.run(() => watchOptions((m) => log.push(m)));
    if (!settings) throw new Error('scope inactive');
    expect(log).toEqual(['immediate dark']);

    log.length = 0;
    settings.value.editor.tabSize = 4; // two levels down
    await nextTick();
    expect(log).toEqual(['deep']);

    log.length = 0;
    settings.value.theme = 'light'; // first level
    await nextTick();
    expect(log).toEqual(['deep', 'depth 1', 'immediate light', 'once light']);

    log.length = 0;
    settings.value = { theme: 'dark', editor: { tabSize: 2 } }; // replacement
    await nextTick();
    expect(log).toEqual(['shallow', 'deep', 'depth 1', 'immediate dark']); // once is gone
  });
});
