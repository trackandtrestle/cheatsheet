<script setup lang="ts">
import { useId } from 'vue';

const { label, hint, error } = defineProps<{ label: string; hint?: string; error?: string }>();
const model = defineModel<string>({ default: '' });

// Unique per instance and stable across SSR + hydration (unlike Math.random()).
const id = useId();
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :aria-describedby="hint ? `${id}-hint` : undefined"
      :aria-invalid="error ? true : undefined"
      :aria-errormessage="error ? `${id}-error` : undefined"
    />
    <p v-if="hint" :id="`${id}-hint`">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" role="alert">{{ error }}</p>
  </div>
</template>
