<script setup lang="ts">
import { ref } from 'vue';

interface Signup {
  email: string;
  plan: 'free' | 'pro';
}

// Object syntax: the parameter types type the event, the return value is a
// dev-only runtime validator (false -> console warning, the event still fires).
const emit = defineEmits({
  submit: (payload: Signup) => payload.email.includes('@'),
  cancel: () => true, // no payload; `cancel: null` would leave the listener untyped
});

const email = ref('');
const plan = ref<Signup['plan']>('free');
</script>

<template>
  <form @submit.prevent="emit('submit', { email, plan })">
    <label>Email <input v-model.trim="email" autocomplete="email" /></label>
    <select v-model="plan" aria-label="Plan">
      <option value="free">Free</option>
      <option value="pro">Pro</option>
    </select>
    <button type="submit" class="btn btn-primary">Sign up</button>
    <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
  </form>
</template>
