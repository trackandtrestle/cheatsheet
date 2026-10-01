<script setup lang="ts">
import { onScopeDispose, shallowRef } from 'vue';

// Honour the OS "reduce motion" setting, and react if the user changes it.
const query = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = shallowRef(query.matches);
const onChange = (e: MediaQueryListEvent) => (reduced.value = e.matches);
query.addEventListener('change', onChange);
onScopeDispose(() => query.removeEventListener('change', onChange));
// :css="false" (and no JS hooks) = no classes, no transitionend wait: an instant swap.
</script>

<template>
  <Transition name="fade" :css="!reduced">
    <slot />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
