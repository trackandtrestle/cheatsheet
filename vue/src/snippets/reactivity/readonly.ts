import { reactive, readonly, shallowReadonly } from 'vue';

export function createCounterStore() {
  const state = reactive({ count: 0, user: { name: 'Ada' } });

  const increment = () => {
    state.count++;
  };

  // A live, deeply read-only VIEW of the same state: consumers read, actions write.
  // Writes are a type error (DeepReadonly) and are ignored with a dev warning.
  return { state: readonly(state), increment };
}

// shallowReadonly: only top-level keys are protected; nested objects stay writable.
export function createConfig() {
  return shallowReadonly({ env: 'prod', flags: { beta: false } });
}
