<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue';

defineOptions({ name: 'CounterPanel' });
const clicks = ref(0);
const activations = ref(0);
const lastLeft = ref<string | null>(null);

onActivated(() => activations.value++);
onDeactivated(() => (lastLeft.value = new Date().toLocaleTimeString()));
</script>

<template>
  <div class="demo-row">
    <button type="button" class="btn btn-small" @click="clicks++">Clicked {{ clicks }}×</button>
    <span class="mono">onActivated ran {{ activations }}× · last left: {{ lastLeft ?? '—' }}</span>
  </div>
</template>
