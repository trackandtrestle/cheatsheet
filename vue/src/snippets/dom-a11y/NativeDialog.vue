<script setup lang="ts">
import { useId, useTemplateRef, watch } from 'vue';

defineProps<{ title: string }>();
const open = defineModel<boolean>('open', { required: true });
const emit = defineEmits<{ close: [returnValue: string] }>();
const dialog = useTemplateRef('dialog');
const titleId = useId();

// State drives the DOM API; the native `close` event (Escape, .close()) syncs state back.
watch([open, dialog], ([isOpen, el]) => {
  if (!el || isOpen === el.open) return;
  if (isOpen) el.showModal(); // modal: focus trap, inert page, ::backdrop, top layer
  else el.close();
});
function onClose() {
  open.value = false;
  emit('close', dialog.value?.returnValue ?? '');
}
</script>

<template>
  <dialog ref="dialog" :aria-labelledby="titleId" @close="onClose">
    <h2 :id="titleId">{{ title }}</h2>
    <slot />
    <button type="button" autofocus @click="dialog?.close('cancel')">Cancel</button>
    <button type="button" @click="dialog?.close('confirm')">Confirm</button>
  </dialog>
</template>
