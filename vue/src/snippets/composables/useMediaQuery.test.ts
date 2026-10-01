import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useMediaQuery, usePreferredDark } from './useMediaQuery';

function withSetup<T>(composable: () => T) {
  let result!: T;
  const wrapper = mount(defineComponent({
    setup() {
      result = composable();
      return () => null;
    },
  }));
  return { result, wrapper };
}

/** Minimal matchMedia mock: `active` decides matches; `emit` simulates a change. */
type Listener = (e: { matches: boolean }) => void;
const active = new Set<string>();
const listeners = new Map<string, Set<Listener>>();
function emit(query: string, matches: boolean) {
  if (matches) active.add(query);
  else active.delete(query);
  listeners.get(query)?.forEach((l) => l({ matches }));
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return active.has(query);
    },
    addEventListener: (_: 'change', l: Listener) => {
      listeners.set(query, (listeners.get(query) ?? new Set()).add(l));
    },
    removeEventListener: (_: 'change', l: Listener) => listeners.get(query)?.delete(l),
  }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  active.clear();
  listeners.clear();
});

describe('useMediaQuery', () => {
  it('reads the initial match and follows change events', () => {
    active.add('(prefers-color-scheme: dark)');
    const { result: dark } = withSetup(usePreferredDark);
    expect(dark.value).toBe(true);
    emit('(prefers-color-scheme: dark)', false);
    expect(dark.value).toBe(false);
  });

  it('re-subscribes when a reactive query changes and cleans up on unmount', async () => {
    const q = ref('(min-width: 600px)');
    const { result, wrapper } = withSetup(() => useMediaQuery(q));
    expect(listeners.get('(min-width: 600px)')?.size).toBe(1);
    q.value = '(min-width: 900px)';
    active.add('(min-width: 900px)');
    await nextTick();
    expect(result.value).toBe(true);
    expect(listeners.get('(min-width: 600px)')?.size).toBe(0);
    wrapper.unmount();
    expect(listeners.get('(min-width: 900px)')?.size).toBe(0);
  });
});
