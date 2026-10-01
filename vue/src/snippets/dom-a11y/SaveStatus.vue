<script setup lang="ts">
import { ref } from 'vue';

const { save } = defineProps<{ save: () => Promise<void> }>();
const status = ref('');
const error = ref('');

async function onSave() {
  error.value = '';
  status.value = 'Saving…'; // a change from the last message, so "Saved" is re-announced
  try {
    await save();
    status.value = 'Saved';
  } catch (e) {
    status.value = '';
    error.value = e instanceof Error ? e.message : 'Save failed';
  }
}
</script>

<template>
  <button type="button" @click="onSave">Save</button>
  <!-- Live regions are ALWAYS rendered (empty at first); only their text changes.
       v-if would insert region + text together, which screen readers often skip. -->
  <p role="status">{{ status }}</p>
  <!-- role="alert" is assertive: interrupts the user. Errors only. -->
  <p role="alert">{{ error }}</p>
</template>
