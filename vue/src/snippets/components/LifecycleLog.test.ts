import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import LifecycleLog from './LifecycleLog.vue';

describe('lifecycle hook order', () => {
  it('parent setup first, child mounted first; unmount parent-first, unmounted child-first', async () => {
    const entries: string[] = [];
    const log = (e: string) => entries.push(e);
    const { rerender, unmount } = render(LifecycleLog, {
      props: { name: 'parent', log },
      slots: { default: () => h(LifecycleLog, { name: 'child', log }) },
    });
    expect(entries.splice(0)).toEqual([
      'parent setup',
      'parent beforeMount',
      'child setup',
      'child beforeMount',
      'child mounted',
      'parent mounted',
    ]);

    await rerender({ tick: 1 }); // only the parent's own DOM changes
    expect(entries.splice(0)).toEqual(['parent beforeUpdate', 'parent updated']);

    unmount();
    expect(entries).toEqual(['parent beforeUnmount', 'child beforeUnmount', 'child unmounted', 'parent unmounted']);
  });
});
