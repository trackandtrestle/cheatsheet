import { onScopeDispose, toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

/** Keeps document.title in sync with a string, ref or getter. */
export function useTitle(title: MaybeRefOrGetter<string>, { restore = true } = {}): void {
  if (typeof document === 'undefined') return; // SSR: set <title> via your head manager

  const original = document.title;
  watchEffect(() => {
    document.title = toValue(title);
  });
  if (restore) onScopeDispose(() => (document.title = original));
}
