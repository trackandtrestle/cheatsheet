<script setup lang="ts">
import { useAttrs } from 'vue';

// Don't put class/placeholder/listeners on the root <label>...
defineOptions({ inheritAttrs: false });

const { label } = defineProps<{ label: string }>();
const model = defineModel<string>({ default: '' });

// Not reactive itself, but always current: read it in the template or a handler.
const attrs = useAttrs();
</script>

<template>
  <label class="field" :class="{ invalid: attrs['aria-invalid'] === 'true' }">
    <span>{{ label }}</span>
    <!-- ...forward them to the element that actually needs them -->
    <input v-bind="$attrs" v-model="model" />
  </label>
</template>
