<script setup lang="ts">
import { useId, useTemplateRef, watch } from 'vue';

const { title, inline = false } = defineProps<{ title: string; inline?: boolean }>();
const open = defineModel<boolean>('open', { default: false });
const titleId = useId();
const dialog = useTemplateRef('dialog');

// flush: 'post' runs after the DOM update, so the dialog exists when we focus it.
watch(open, (isOpen) => isOpen && dialog.value?.focus(), { flush: 'post' });
</script>

<template>
  <!-- Rendered at <body> to escape overflow/z-index of ancestors; `disabled` renders in place -->
  <Teleport to="body" :disabled="inline">
    <div v-if="open" class="modal-backdrop" @click.self="open = false">
      <div
        ref="dialog"
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown.esc="open = false"
      >
        <h2 :id="titleId">{{ title }}</h2>
        <slot />
        <button type="button" class="btn" @click="open = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
