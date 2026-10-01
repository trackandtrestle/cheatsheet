<script setup lang="ts">
import { ref } from 'vue';

const tags = defineModel<string[]>({ default: () => [] });
const draft = ref('');

// Name the DOM event type; `event.target` is only `EventTarget | null`, so narrow it.
function onKeydown(event: KeyboardEvent) {
  if (event.isComposing) return; // IME composition: Enter confirms a character
  const value = draft.value.trim();
  if (event.key === 'Enter' && value) {
    event.preventDefault();
    if (!tags.value.includes(value)) tags.value = [...tags.value, value];
    draft.value = '';
  } else if (event.key === 'Backspace' && !draft.value) {
    tags.value = tags.value.slice(0, -1);
  }
}
</script>

<template>
  <ul aria-label="Tags">
    <li v-for="tag in tags" :key="tag">{{ tag }}</li>
  </ul>
  <!-- Inline handlers can annotate the event too (template expressions are TS) -->
  <input
    :value="draft"
    aria-label="Add tag"
    @input="(e: Event) => (draft = (e.target as HTMLInputElement).value)"
    @keydown="onKeydown"
  />
</template>
