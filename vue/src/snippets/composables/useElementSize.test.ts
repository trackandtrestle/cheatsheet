import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { render, screen } from '@testing-library/vue';
import { useElementSize } from './useElementSize';

class MockRO {
  static last: MockRO | undefined;
  disconnected = false;
  constructor(public cb: (entries: Array<{ contentRect: { width: number; height: number } }>) => void) {
    MockRO.last = this;
  }
  observe() {}
  disconnect() {
    this.disconnected = true;
  }
  resize(width: number, height: number) {
    this.cb([{ contentRect: { width, height } }]);
  }
}

beforeEach(() => vi.stubGlobal('ResizeObserver', MockRO));
afterEach(() => vi.unstubAllGlobals());

const Box = defineComponent({
  setup() {
    const box = useTemplateRef<HTMLElement>('box');
    const { width, height } = useElementSize(box);
    return () => h('div', { ref: 'box' }, `${width.value}x${height.value}`);
  },
});

describe('useElementSize', () => {
  it('renders the observed size and disconnects on unmount', async () => {
    const { unmount } = render(Box);
    await nextTick();
    MockRO.last!.resize(320, 180);
    expect(await screen.findByText('320x180')).toBeInTheDocument();
    unmount();
    expect(MockRO.last!.disconnected).toBe(true);
  });
});
