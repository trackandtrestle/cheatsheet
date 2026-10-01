import { describe, expect, it } from 'vitest';
import { computed, isReactive } from 'vue';
import { useRows } from './shallowRef';

describe('shallowRef + triggerRef', () => {
  it('tracks replacement but not in-place mutation until triggerRef', () => {
    const { rows, toggle, toggleInPlace, forceUpdate } = useRows([{ id: 1, done: false }]);
    const doneCount = computed(() => rows.value.filter((r) => r.done).length);
    expect(isReactive(rows.value)).toBe(false);

    toggle(1);
    expect(doneCount.value).toBe(1);

    toggleInPlace(1);
    expect(doneCount.value).toBe(1); // stale: computed was never notified

    forceUpdate();
    expect(doneCount.value).toBe(0);
  });
});
