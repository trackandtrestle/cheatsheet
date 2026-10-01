<script setup lang="ts">
import { ref, useId } from 'vue';

const { title, mode = 'if' } = defineProps<{ title: string; mode?: 'if' | 'show' }>();
const open = ref(false);
const panelId = useId();
</script>

<template>
  <button type="button" :aria-expanded="open" :aria-controls="panelId" @click="open = !open">
    {{ title }}
  </button>
  <!-- v-if: created/destroyed on toggle; slot content (and its state) is torn down -->
  <template v-if="mode === 'if'">
    <div v-if="open" :id="panelId"><slot /></div>
  </template>
  <!-- v-show: rendered once, toggled with display:none; cheap to flip often -->
  <div v-else v-show="open" :id="panelId"><slot /></div>
</template>
