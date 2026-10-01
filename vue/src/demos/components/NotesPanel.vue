<script setup lang="ts">
import { ref } from 'vue';

defineOptions({ name: 'NotesPanel' });
const notes = ref('');
</script>

<template>
  <label class="panel-field">
    Notes (type, switch tabs, come back)
    <textarea v-model="notes" rows="3" />
  </label>
</template>

<style scoped>
.panel-field {
  display: grid;
  gap: 0.25rem;
}
textarea {
  font: inherit;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem;
}
</style>
