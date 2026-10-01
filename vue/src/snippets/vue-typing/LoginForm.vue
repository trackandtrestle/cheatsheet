<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import FocusInput from './FocusInput.vue';

// A component ref is typed as its instance; only what it defineExpose()s is visible.
// vue-tsc infers this from the template too; the explicit type documents it and
// is what you write in .ts files. (For generic components use ComponentInstance.)
const emailInput = useTemplateRef<InstanceType<typeof FocusInput>>('email');
const email = ref('');
const error = ref('');

function submit() {
  if (emailInput.value?.isEmpty) {
    error.value = 'Email is required';
    emailInput.value.focus();
  }
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <FocusInput ref="email" v-model="email" label="Email" />
    <p v-if="error" role="alert">{{ error }}</p>
    <button type="submit" class="btn btn-primary">Log in</button>
  </form>
</template>
