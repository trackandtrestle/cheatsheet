import { onScopeDispose, ref, watch, type Ref } from 'vue';

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T; // trust boundary: validate here if the shape matters
  } catch {
    return fallback; // corrupt / hand-edited JSON
  }
}

export function useLocalStorage<T>(key: string, initial: T): Ref<T> {
  const canUse = typeof window !== 'undefined';
  const state = ref(canUse ? parse(localStorage.getItem(key), initial) : initial) as Ref<T>;
  if (!canUse) return state;

  // deep: nested mutations (state.value.name = 'x') are persisted too
  watch(state, (value) => localStorage.setItem(key, JSON.stringify(value)), { deep: true });

  // other tabs write -> 'storage' fires here (never in the writing tab)
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) state.value = parse(e.newValue, initial);
  };
  window.addEventListener('storage', onStorage);
  onScopeDispose(() => window.removeEventListener('storage', onStorage));

  return state;
}
