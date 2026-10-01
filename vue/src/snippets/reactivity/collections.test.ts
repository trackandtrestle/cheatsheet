import { describe, expect, it } from 'vitest';
import { computed } from 'vue';
import { useTodos } from './collections';

describe('reactive collections', () => {
  it('tracks push, nested mutation, splice, Set and Map operations', () => {
    const t = useTodos();
    const vueTag = computed(() => t.tagCounts.get('vue') ?? 0);

    t.add('a', ['vue']);
    t.add('b', ['vue', 'ts']);
    expect(t.remaining.value).toBe(2);
    expect(vueTag.value).toBe(2);

    t.toggleDone(0);
    expect(t.remaining.value).toBe(1);

    t.toggleSelected(1);
    expect(t.selectedCount.value).toBe(1);
    t.toggleSelected(1);
    expect(t.selectedCount.value).toBe(0);

    t.clear();
    expect(t.remaining.value).toBe(0);
  });
});
