import { computed, isRef, toValue, unref, type MaybeRef, type MaybeRefOrGetter } from 'vue';

// Accept a plain value, a ref or a getter — callers choose how reactive the input is.
export function useTitle(
  title: MaybeRefOrGetter<string>,
  suffix: MaybeRefOrGetter<string> = 'My App',
) {
  // Call toValue INSIDE the computed so the dependency is tracked.
  return computed(() => `${toValue(title)} · ${toValue(suffix)}`);
}

// unref handles value | ref but NOT getters; isRef narrows the type.
export function describeInput(input: MaybeRef<number>): string {
  return isRef(input) ? `ref(${input.value})` : `plain(${unref(input)})`;
}
