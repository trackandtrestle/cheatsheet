<script setup lang="ts">
const { status, error } = defineProps<{
  status: 'loading' | 'error' | 'ready';
  error?: Error;
}>();

// Types the slots for consumers (and checks this template). Optional slots use `?`.
defineSlots<{
  default(): unknown;
  loading?(): unknown;
  error?(props: { error: Error; message: string }): unknown;
}>();
</script>

<template>
  <slot v-if="status === 'loading'" name="loading">
    <p role="status">Loading…</p>
  </slot>
  <slot
    v-else-if="status === 'error'"
    name="error"
    :error="error ?? new Error('Unknown error')"
    :message="error?.message ?? 'Unknown error'"
  >
    <p role="alert">{{ error?.message ?? 'Unknown error' }}</p>
  </slot>
  <slot v-else />
</template>
