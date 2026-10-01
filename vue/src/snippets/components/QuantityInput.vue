<script setup lang="ts">
const { min = 0, max = 99 } = defineProps<{ min?: number; max?: number }>();

// Declares the `modelValue` prop + `update:modelValue` event and returns a ref:
// reading it reads the prop, writing it emits the update.
const quantity = defineModel<number>({ default: 1 });

function step(delta: number) {
  quantity.value = Math.min(max, Math.max(min, quantity.value + delta));
}
</script>

<template>
  <div class="demo-row" role="group" aria-label="Quantity">
    <button
      type="button"
      class="btn btn-small"
      aria-label="Decrease"
      :disabled="quantity <= min"
      @click="step(-1)"
    >
      −
    </button>
    <output class="mono" aria-live="polite">{{ quantity }}</output>
    <button
      type="button"
      class="btn btn-small"
      aria-label="Increase"
      :disabled="quantity >= max"
      @click="step(1)"
    >
      +
    </button>
  </div>
</template>
