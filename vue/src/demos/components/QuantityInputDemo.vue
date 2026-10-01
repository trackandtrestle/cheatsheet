<script setup lang="ts">
import { computed, ref } from 'vue';
import QuantityInput from '../../snippets/components/QuantityInput.vue';

const quantity = ref(2);
const unitPrice = 4.5;
const total = computed(() => (quantity.value * unitPrice).toFixed(2));
</script>

<template>
  <div class="demo-row">
    <QuantityInput v-model="quantity" :min="1" :max="10" />
    <span>× ${{ unitPrice.toFixed(2) }} = <strong class="mono">${{ total }}</strong></span>
    <button type="button" class="btn btn-small" @click="quantity = 1">Reset (parent writes)</button>
  </div>
  <p class="mono demo-note">parent ref: quantity = {{ quantity }}</p>
</template>

<style scoped>
.demo-note {
  color: var(--muted);
  margin: 0.5rem 0 0;
}
</style>
