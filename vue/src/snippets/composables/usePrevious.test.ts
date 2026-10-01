import { describe, expect, it } from 'vitest';
import { effectScope, reactive, ref } from 'vue';
import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('holds the value before the latest change', () => {
    const scope = effectScope();
    const count = ref(1);
    const prev = scope.run(() => usePrevious(count))!;
    expect(prev.value).toBeUndefined();
    count.value = 2;
    count.value = 3;
    expect(prev.value).toBe(2);
    scope.stop();
    count.value = 4;
    expect(prev.value).toBe(2); // watcher stopped with the scope
  });

  it('works with a getter; mutating an object in place is not a change', () => {
    const scope = effectScope();
    const user = reactive({ name: 'Ada' });
    const list = reactive({ items: [1] });
    const prevName = scope.run(() => usePrevious(() => user.name))!;
    const prevItems = scope.run(() => usePrevious(() => list.items))!;
    user.name = 'Grace';
    list.items.push(2); // same array reference -> getter watcher does not fire
    expect(prevName.value).toBe('Ada');
    expect(prevItems.value).toBeUndefined();
    scope.stop();
  });
});
