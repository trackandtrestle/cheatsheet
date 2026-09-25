import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useElementSize } from './useElementSize';

// jsdom has no layout and no ResizeObserver: fake it and push sizes manually.
const instances: { cb: ResizeObserverCallback; disconnect: () => void }[] = [];
class FakeRO {
  disconnect = vi.fn();
  constructor(public cb: ResizeObserverCallback) { instances.push(this); }
  observe() {}
  unobserve() {}
}
const resize = (inlineSize: number, blockSize: number) =>
  act(() => instances.at(-1)?.cb([{ contentBoxSize: [{ inlineSize, blockSize }] } as unknown as ResizeObserverEntry], {} as ResizeObserver));

function Panel() {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  return <div ref={ref}>{width}×{height}{width < 400 && <span> (compact)</span>}</div>;
}

describe('useElementSize', () => {
  beforeEach(() => vi.stubGlobal('ResizeObserver', FakeRO));
  afterEach(() => { vi.unstubAllGlobals(); instances.length = 0; });

  it('re-renders with the observed size and disconnects on unmount', () => {
    const { unmount } = render(<Panel />);
    resize(320, 100);
    expect(screen.getByText(/320×100/)).toHaveTextContent('(compact)');
    resize(800, 100);
    expect(screen.getByText('800×100')).toBeInTheDocument();
    unmount();
    expect(instances[0]?.disconnect).toHaveBeenCalled();
  });
});
