import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { useElementSize } from './useElementSize';

// jsdom has no layout and no ResizeObserver: push sizes from the test.
let resize: (inlineSize: number, blockSize: number) => void = () => {};
const disconnect = vi.fn();
class FakeRO {
  constructor(cb: (entries: { contentBoxSize: { inlineSize: number; blockSize: number }[] }[]) => void) {
    resize = (inlineSize, blockSize) => cb([{ contentBoxSize: [{ inlineSize, blockSize }] }]);
  }
  observe() {}
  disconnect = disconnect;
}
beforeEach(() => vi.stubGlobal('ResizeObserver', FakeRO));
afterEach(() => vi.unstubAllGlobals());

const Card = defineComponent(() => {
  const el = useTemplateRef<HTMLElement>('el');
  const { width } = useElementSize(el);
  return () => h('div', { ref: 'el' }, width.value < 400 ? 'compact' : 'wide');
});

describe('useElementSize', () => {
  it('re-renders when the element (not the window) resizes, and disconnects on unmount', async () => {
    const { unmount } = render(Card);
    await flushPromises();
    resize(320, 100);
    await nextTick();
    expect(screen.getByText('compact')).toBeInTheDocument();
    resize(800, 100);
    await nextTick();
    expect(screen.getByText('wide')).toBeInTheDocument();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
