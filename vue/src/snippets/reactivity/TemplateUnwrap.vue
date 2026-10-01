<script setup lang="ts">
import { ref } from 'vue';

const count = ref(1);
// A plain (non-reactive) object holding a ref: the ref is NOT top-level.
const obj = { nested: ref(1) };
// Destructure it so the ref becomes a top-level binding again.
const { nested } = obj;
</script>

<template>
  <!-- Top-level ref: auto-unwrapped -->
  <p data-testid="top">{{ count + 1 }}</p>
  <!-- `obj.nested + 1` would render "[object Object]1" (vue-tsc rejects it) -->
  <p data-testid="nested">{{ obj.nested.value + 1 }}</p>
  <!-- Exception: a ref that is the final value of an interpolation is unwrapped -->
  <p data-testid="final">{{ obj.nested }}</p>
  <p data-testid="destructured">{{ nested + 1 }}</p>
</template>
