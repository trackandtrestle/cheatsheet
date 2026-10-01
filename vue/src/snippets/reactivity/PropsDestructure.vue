<script setup lang="ts">
import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue';

// 3.5: destructured props stay reactive — the compiler rewrites `count` to `props.count`.
const { count = 0, label = 'Count' } = defineProps<{ count?: number; label?: string }>();
const emit = defineEmits<{ change: [next: number, prev: number] }>();

const doubled = computed(() => count * 2); // reactive: compiled to props.count

// watch(count, ...) is a compile error (it would pass a plain number) — wrap in a getter.
watch(
  () => count,
  (next, prev) => emit('change', next, prev),
);

// Composables: pass a getter, not the value, so they can track it.
function useParity(source: MaybeRefOrGetter<number>) {
  return computed(() => (toValue(source) % 2 === 0 ? 'even' : 'odd'));
}
const parity = useParity(() => count); // useParity(count) would freeze the initial value
</script>

<template>
  <p>{{ label }}: {{ count }} × 2 = {{ doubled }} ({{ parity }})</p>
</template>
