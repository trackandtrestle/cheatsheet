<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const emit = defineEmits<{ error: [error: Error] }>();
const error = ref<Error | null>(null);

// Catches errors from descendants: render, setup, lifecycle hooks, watchers
// and component event handlers. Not its own errors, not setTimeout callbacks.
onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err));
  emit('error', error.value);
  return false; // handled: stop propagation to parents / app.config.errorHandler
});

function reset() {
  error.value = null;
}
</script>

<template>
  <div v-if="error" role="alert">
    <slot name="fallback" :error="error" :reset="reset">
      <p>Something went wrong: {{ error.message }}</p>
      <button type="button" class="btn" @click="reset">Try again</button>
    </slot>
  </div>
  <slot v-else />
</template>
