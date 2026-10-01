import { computed, effectScope, onScopeDispose, ref, watch } from 'vue';

// Group effects created outside a component (stores, services, tests) and dispose them at once.
export function createTicker(onTick: (count: number) => void, intervalMs = 1000) {
  const scope = effectScope();

  const api = scope.run(() => {
    const count = ref(0);
    const doubled = computed(() => count.value * 2);
    watch(count, onTick); // collected by the scope

    const id = setInterval(() => count.value++, intervalMs);
    onScopeDispose(() => clearInterval(id)); // like onUnmounted, for any scope

    return { count, doubled };
  });
  if (!api) throw new Error('effect scope is inactive');

  // Stops the watcher and computed, and runs every onScopeDispose callback.
  return { ...api, dispose: () => scope.stop() };
}
