<script setup lang="ts">
const { min = 0, max = 10 } = defineProps<{ min?: number; max?: number }>();
const quantity = defineModel<number>({ required: true });
const set = (n: number) => (quantity.value = Math.min(max, Math.max(min, n)));
</script>

<template>
  <div role="group" aria-label="Quantity">
    <button type="button" aria-label="Decrease" :disabled="quantity <= min" @click="set(quantity - 1)">−</button>
    <output>{{ quantity }}</output>
    <button type="button" aria-label="Increase" :disabled="quantity >= max" @click="set(quantity + 1)">+</button>
  </div>
</template>
