<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const error = ref<Error | null>(null);
const attempt = ref(0);

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err));
  console.error(err);
  return false; // stop propagation: one broken demo must not take down the page
});

function retry() {
  error.value = null;
  attempt.value++; // remount the slot from scratch
}
</script>

<template>
  <div v-if="error" role="alert" class="demo-error">
    Demo crashed: {{ error.message }}
    <button type="button" class="btn btn-small" @click="retry">Retry</button>
  </div>
  <div v-else :key="attempt"><slot /></div>
</template>
