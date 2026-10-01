import { computed, onScopeDispose, readonly, shallowRef, toValue, type MaybeRefOrGetter } from 'vue';

/**
 * Anatomy of a composable:
 * 1. `use` prefix, called synchronously from setup() (or an effectScope).
 * 2. Inputs are MaybeRefOrGetter and read with toValue() *inside* a reactive
 *    context (computed/watch), so callers can pass 768, a ref, or () => props.bp.
 * 3. Return a plain object of refs, so `const { width } = useX()` stays reactive.
 * 4. Register cleanup with onScopeDispose (works in components AND effectScopes).
 * 5. Never touch window at module level; guard it for SSR.
 */
export function useWindowWidth(breakpoint: MaybeRefOrGetter<number> = 768) {
  const width = shallowRef(typeof window === 'undefined' ? 0 : window.innerWidth);
  const isWide = computed(() => width.value >= toValue(breakpoint));

  if (typeof window !== 'undefined') {
    const onResize = () => {
      width.value = window.innerWidth;
    };
    window.addEventListener('resize', onResize, { passive: true });
    onScopeDispose(() => window.removeEventListener('resize', onResize));
  }

  return { width: readonly(width), isWide };
}
