import { expect, it, vi } from 'vitest';
import { computed, createApp, effectScope, onMounted, onUnmounted, ref, type Ref } from 'vue';
const useDouble = (n: Ref<number>) => computed(() => n.value * 2);
function useOnline() {
  const online = ref(navigator.onLine);
  const update = () => (online.value = navigator.onLine);
  onMounted(() => window.addEventListener('offline', update));
  onUnmounted(() => window.removeEventListener('offline', update));
  return online;
}
// Lifecycle hooks need a component instance: mount a throwaway host app.
function withSetup<T>(composable: () => T) {
  let result!: T;
  const app = createApp({ setup: () => { result = composable(); return () => null; } });
  app.mount(document.createElement('div'));
  return [result, app] as const;
}

it('no lifecycle hooks? run it in an effectScope and stop() it after', () => {
  const n = ref(2);
  const scope = effectScope(); // collects computeds/watchers so they don't leak
  const double = scope.run(() => useDouble(n))!;
  n.value = 5;
  expect(double.value).toBe(10);
  scope.stop(); // in a real app the component's scope does this on unmount
});

it('withSetup runs onMounted / onUnmounted', () => {
  const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
  const [online, app] = withSetup(useOnline);
  onLine.mockReturnValue(false);
  window.dispatchEvent(new Event('offline'));
  expect(online.value).toBe(false); // listener added in onMounted…
  app.unmount();
  onLine.mockReturnValue(true);
  window.dispatchEvent(new Event('offline'));
  expect(online.value).toBe(false); // …and removed in onUnmounted
  onLine.mockRestore();
});
