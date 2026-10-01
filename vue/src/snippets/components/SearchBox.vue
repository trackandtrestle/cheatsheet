<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

const { focusOnMount = false } = defineProps<{ focusOnMount?: boolean }>();
const query = defineModel<string>({ default: '' });

// 3.5+: the ref name is a string; vue-tsc infers HTMLInputElement | null from the template.
const input = useTemplateRef('input');

onMounted(() => {
  if (focusOnMount) input.value?.focus(); // null until mounted
});

function focus() {
  input.value?.focus();
}
function clear() {
  query.value = '';
  focus();
}

// <script setup> components are closed by default: expose only this API to parent refs.
defineExpose({ focus, clear });
</script>

<template>
  <input ref="input" v-model="query" type="search" aria-label="Search" />
</template>
