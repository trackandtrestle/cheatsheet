<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

const { label } = defineProps<{ label: string }>();
const value = defineModel<string>({ default: '' });
const input = useTemplateRef('input');

function focus(): void {
  input.value?.focus();
}

defineExpose({
  focus,
  isEmpty: computed(() => value.value.trim() === ''),
});
</script>

<template>
  <input ref="input" v-model="value" :aria-label="label" />
</template>
