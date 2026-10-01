import { onScopeDispose, readonly, ref, type Ref } from 'vue';

const read = () => decodeURIComponent(window.location.hash.slice(1));

/** Current `location.hash` without the leading `#`, kept in sync with `hashchange`. */
export function useHash(): Readonly<Ref<string>> {
  const hash = ref(read());
  const onChange = () => (hash.value = read());
  window.addEventListener('hashchange', onChange);
  onScopeDispose(() => window.removeEventListener('hashchange', onChange));
  return readonly(hash);
}
