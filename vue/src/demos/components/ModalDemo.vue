<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import Modal from '../../snippets/components/Modal.vue';

const open = ref(false);
const inline = ref(false);
const opener = useTemplateRef('opener');

// Return focus to the button that opened the dialog.
watch(open, (isOpen) => {
  if (!isOpen) opener.value?.focus();
});
</script>

<template>
  <div class="demo-row">
    <button ref="opener" type="button" class="btn btn-primary" @click="open = true">Open dialog</button>
    <label><input v-model="inline" type="checkbox" /> Teleport disabled (render inline)</label>
  </div>
  <Modal v-model:open="open" title="Teleported dialog" :inline="inline">
    <p>This markup lives at the end of <code>&lt;body&gt;</code> unless Teleport is disabled.</p>
    <p>Press <kbd>Esc</kbd> or click the backdrop to close.</p>
  </Modal>
</template>

<!-- Not scoped: teleported nodes are outside this component's DOM subtree. -->
<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 0.45);
  z-index: 1000;
  padding: 16px;
}
.modal {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  max-width: 28rem;
  width: 100%;
}
.modal:focus-visible {
  outline: 2px solid var(--accent);
}
.modal h2 {
  margin-top: 0;
  font-size: 1.15rem;
}
</style>
