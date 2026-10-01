<script setup lang="ts">
import { computed, ref, watch } from 'vue';

// 3.5+: destructured props stay reactive. The compiler rewrites every `name`
// below to `__props.name`, and the `=` defaults become runtime prop defaults.
const {
  name,
  greeting = 'Hello',
  excited = false,
} = defineProps<{
  name: string;
  greeting?: string;
  excited?: boolean;
}>();

const message = computed(() => `${greeting}, ${name}${excited ? '!' : '.'}`);

// Watch a destructured prop through a getter; `watch(name, …)` is a compile error.
const renames = ref(0);
watch(
  () => name,
  () => renames.value++,
);
</script>

<template>
  <p>{{ message }}</p>
  <p class="mono">renamed {{ renames }}×</p>
</template>
