import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

// jsdom has no matchMedia: a minimal controllable fake.
function installMatchMedia(initial: Record<string, boolean>) {
  const state = { ...initial };
  const listeners = new Map<string, Set<() => void>>();
  const matchMedia = vi.fn((query: string) => ({
    get matches() { return state[query] ?? false; },
    media: query,
    addEventListener: (_: 'change', cb: () => void) => {
      listeners.set(query, (listeners.get(query) ?? new Set()).add(cb));
    },
    removeEventListener: (_: 'change', cb: () => void) => listeners.get(query)?.delete(cb),
  }));
  vi.stubGlobal('matchMedia', matchMedia);
  return {
    set(query: string, matches: boolean) {
      state[query] = matches;
      listeners.get(query)?.forEach((cb) => cb());
    },
    listenerCount: (query: string) => listeners.get(query)?.size ?? 0,
  };
}

describe('useMediaQuery', () => {
  let mq: ReturnType<typeof installMatchMedia>;
  beforeEach(() => { mq = installMatchMedia({ '(min-width: 800px)': true }); });
  afterEach(() => vi.unstubAllGlobals());

  it('reads the current match and re-renders on change', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'));
    expect(result.current).toBe(true);
    act(() => mq.set('(min-width: 800px)', false));
    expect(result.current).toBe(false);
  });

  it('re-subscribes when the query changes and cleans up on unmount', () => {
    const { result, rerender, unmount } = renderHook(({ q }) => useMediaQuery(q), {
      initialProps: { q: '(min-width: 800px)' },
    });
    rerender({ q: '(prefers-reduced-motion: reduce)' });
    expect(result.current).toBe(false);
    expect(mq.listenerCount('(min-width: 800px)')).toBe(0);
    expect(mq.listenerCount('(prefers-reduced-motion: reduce)')).toBe(1);
    unmount();
    expect(mq.listenerCount('(prefers-reduced-motion: reduce)')).toBe(0);
  });
});
