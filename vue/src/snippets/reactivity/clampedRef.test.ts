import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, effectScope, h, nextTick, watch } from 'vue';
import { mount } from '@vue/test-utils';
import { clampedRef } from './clampedRef';

describe('clampedRef (customRef)', () => {
  const scope = effectScope();
  afterEach(() => scope.stop());

  it('clamps writes and triggers only on real changes or rejected input', () => {
    const volume = clampedRef(150, 0, 100);
    expect(volume.value).toBe(100);

    let runs = 0;
    scope.run(() => watch(volume, () => runs++, { flush: 'sync' }));
    volume.value = 100;
    expect(runs).toBe(0); // same value: no trigger
    volume.value = -5;
    expect(volume.value).toBe(0);
    volume.value = Number.NaN;
    expect(volume.value).toBe(0);
  });

  it('snaps a bound input back into range', async () => {
    const Comp = defineComponent(() => {
      const volume = clampedRef(100, 0, 100);
      return () => h('input', { value: volume.value, onInput: (e: Event) => {
        volume.value = Number((e.target as HTMLInputElement).value);
      } });
    });
    const wrapper = mount(Comp);
    await wrapper.get('input').setValue('250');
    await nextTick();
    expect(wrapper.get('input').element.value).toBe('100');
  });
});
