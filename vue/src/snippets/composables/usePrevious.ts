import { shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';

/** The value `source` had before its latest change (undefined at first). */
export function usePrevious<T>(source: MaybeRefOrGetter<T>): Readonly<Ref<T | undefined>> {
  const previous = shallowRef<T>();
  // 'sync' keeps previous/current consistent even for several changes per tick
  watch(() => toValue(source), (_value, old) => {
    previous.value = old;
  }, { flush: 'sync' });
  return previous;
}
