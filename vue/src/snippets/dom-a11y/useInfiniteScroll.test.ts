import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, ref, useTemplateRef } from 'vue';
import { useInfiniteScroll } from './useInfiniteScroll';

// jsdom has no IntersectionObserver: a fake that lets the test decide what is visible.
const observers: FakeIO[] = [];
class FakeIO {
  targets = new Set<Element>();
  disconnected = false;
  constructor(private cb: (entries: { isIntersecting: boolean }[]) => void) { observers.push(this); }
  observe(el: Element) { this.targets.add(el); }
  unobserve(el: Element) { this.targets.delete(el); }
  disconnect() { this.disconnected = true; this.targets.clear(); }
  fire(isIntersecting: boolean) { this.cb([{ isIntersecting }]); }
}
beforeEach(() => { observers.length = 0; vi.stubGlobal('IntersectionObserver', FakeIO); });
afterEach(() => vi.unstubAllGlobals());

const Feed = defineComponent(() => {
  const items = ref([1, 2, 3]);
  const sentinel = useTemplateRef<HTMLElement>('sentinel');
  const loadMore = vi.fn(async () => { items.value.push(items.value.length + 1); });
  const { loading } = useInfiniteScroll(sentinel, loadMore, { enabled: () => items.value.length < 5 });
  return () => h('div', [
    h('ul', items.value.map((i) => h('li', { key: i }, `Item ${i}`))),
    h('div', { ref: 'sentinel', 'aria-busy': loading.value }),
  ]);
});

describe('useInfiniteScroll', () => {
  it('loads when the sentinel intersects and disconnects when disabled', async () => {
    render(Feed);
    await flushPromises();
    const io = observers[0]!;
    io.fire(false);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    io.fire(true);
    await flushPromises();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(io.targets.size).toBe(1); // re-observed after loading
    expect(observers).toHaveLength(1); // not recreated per page

    io.fire(true);
    await flushPromises();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(io.disconnected).toBe(true); // enabled -> false…
    expect(io.targets.size).toBe(0); // …and not re-observed by the finished load
  });
});
