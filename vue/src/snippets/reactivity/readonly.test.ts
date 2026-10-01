import { afterEach, describe, expect, it, vi } from 'vitest';
import { computed, isReadonly } from 'vue';
import { createConfig, createCounterStore } from './readonly';

describe('readonly / shallowReadonly', () => {
  afterEach(() => vi.restoreAllMocks());

  it('is a live view that rejects writes', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { state, increment } = createCounterStore();
    const count = computed(() => state.count);
    increment();
    expect(count.value).toBe(1); // reflects source changes

    // @ts-expect-error -- readonly at the type level too
    state.user.name = 'Grace';
    expect(state.user.name).toBe('Ada');
    expect(warn).toHaveBeenCalled();
  });

  it('shallowReadonly only protects the top level', () => {
    const config = createConfig();
    expect(isReadonly(config)).toBe(true);
    config.flags.beta = true;
    expect(config.flags.beta).toBe(true);
  });
});
