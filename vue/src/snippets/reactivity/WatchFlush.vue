<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';

type Flush = 'pre' | 'post' | 'sync';
const emit = defineEmits<{ measured: [flush: Flush, renderedRows: number] }>();

const items = ref<string[]>([]);
const list = useTemplateRef<HTMLUListElement>('list');
const rows = () => list.value?.children.length ?? 0;
const length = () => items.value.length;

// 'pre' (default): batched, runs BEFORE the component re-renders — DOM is stale.
watch(length, () => emit('measured', 'pre', rows()));
// 'post': batched, runs AFTER the DOM patch — safe to measure/focus (= watchPostEffect).
watch(length, () => emit('measured', 'post', rows()), { flush: 'post' });
// 'sync': runs inside every mutation, no batching — use sparingly.
watch(length, () => emit('measured', 'sync', rows()), { flush: 'sync' });

function addTwo() {
  items.value.push('a');
  items.value.push('b');
}
</script>

<template>
  <button type="button" @click="addTwo">Add two</button>
  <ul ref="list">
    <li v-for="(item, i) in items" :key="i">{{ item }}</li>
  </ul>
</template>
