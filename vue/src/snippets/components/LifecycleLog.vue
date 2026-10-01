<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated } from 'vue';

const { name, log, tick = 0 } = defineProps<{
  name: string;
  log: (entry: string) => void;
  tick?: number;
}>();

log(`${name} setup`); // <script setup> body = setup(): runs once, before mount
onBeforeMount(() => log(`${name} beforeMount`));
onMounted(() => log(`${name} mounted`)); // DOM is available from here
onBeforeUpdate(() => log(`${name} beforeUpdate`));
onUpdated(() => log(`${name} updated`)); // after a re-render patched the DOM
onBeforeUnmount(() => log(`${name} beforeUnmount`));
onUnmounted(() => log(`${name} unmounted`)); // clean up listeners/timers here
</script>

<template>
  <div :data-tick="tick"><slot /></div>
</template>
