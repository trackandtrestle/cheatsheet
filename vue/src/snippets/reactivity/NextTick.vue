<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';

const messages = ref<string[]>([]);
const log = useTemplateRef<HTMLOListElement>('log');

async function add() {
  messages.value.push(`Message ${messages.value.length + 1}`);
  // State changed, DOM not yet: updates are batched and flushed in a microtask.
  // log.value.children.length is still the OLD count here.
  await nextTick();
  // DOM is patched now — safe to measure, scroll or focus.
  log.value?.lastElementChild?.setAttribute('aria-current', 'true');
  if (log.value) log.value.scrollTop = log.value.scrollHeight;
}
</script>

<template>
  <button type="button" @click="add">Add message</button>
  <ol ref="log" class="log">
    <li v-for="m in messages" :key="m">{{ m }}</li>
  </ol>
</template>
