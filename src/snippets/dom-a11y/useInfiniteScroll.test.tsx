import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';

// jsdom has no IntersectionObserver: a tiny fake that the test can drive.
let observed: { cb: IntersectionObserverCallback; el?: Element }[] = [];
class FakeIO {
  private rec: { cb: IntersectionObserverCallback; el?: Element };
  constructor(cb: IntersectionObserverCallback) { this.rec = { cb }; observed.push(this.rec); }
  observe(el: Element) { this.rec.el = el; }
  disconnect() { observed = observed.filter((r) => r !== this.rec); }
}
const scrollIntoView = () =>
  act(() => observed.forEach(({ cb, el }) => cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], {} as IntersectionObserver)));

function Feed() {
  const [items, setItems] = useState(10);
  const ref = useInfiniteScroll(() => setItems((n) => n + 10), { enabled: items < 30 });
  return (<ul>{Array.from({ length: items }, (_, i) => <li key={i}>Item {i}</li>)}<li ref={ref} aria-hidden="true" /></ul>);
}

describe('useInfiniteScroll', () => {
  beforeEach(() => vi.stubGlobal('IntersectionObserver', FakeIO));
  afterEach(() => { vi.unstubAllGlobals(); observed = []; });

  it('loads the next page when the sentinel intersects, stops when disabled', () => {
    render(<Feed />);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    scrollIntoView();
    expect(screen.getAllByRole('listitem')).toHaveLength(20);
    scrollIntoView();
    expect(screen.getAllByRole('listitem')).toHaveLength(30);
    expect(observed).toHaveLength(0); // enabled=false disconnected the observer
  });
});
