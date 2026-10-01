import { readonly, shallowRef, toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export function useMediaQuery(query: MaybeRefOrGetter<string>) {
  const matches = shallowRef(false); // SSR / no matchMedia: assume "no match"

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    // watchEffect re-subscribes whenever a reactive query changes
    watchEffect((onCleanup) => {
      const mql = window.matchMedia(toValue(query));
      matches.value = mql.matches;
      const onChange = (e: MediaQueryListEvent) => {
        matches.value = e.matches;
      };
      mql.addEventListener('change', onChange);
      onCleanup(() => mql.removeEventListener('change', onChange));
    });
  }

  return readonly(matches);
}

export const usePreferredDark = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
