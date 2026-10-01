<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue';
import { useFocusTrap } from '../../snippets/dom-a11y/useFocusTrap';

const open = ref(false);
const advanced = ref(false);
const name = ref('Ada Lovelace');
const saved = ref<string | null>(null);
const titleId = useId();
const dialog = useTemplateRef<HTMLElement>('dialog');

function close() {
  open.value = false;
  advanced.value = false;
}
useFocusTrap(dialog, close);

function save() {
  saved.value = name.value;
  close();
}
</script>

<template>
  <div class="demo-row">
    <button type="button" class="btn btn-primary" @click="open = true">Edit profile</button>
    <span class="mono">Saved: {{ saved ?? '—' }}</span>
  </div>
  <Teleport to="body">
    <div v-if="open" class="ft-backdrop" @click.self="close">
      <div ref="dialog" class="ft-dialog" role="dialog" aria-modal="true" :aria-labelledby="titleId" tabindex="-1">
        <h2 :id="titleId" class="ft-title">Edit profile</h2>
        <label class="ft-field">Name <input v-model="name" /></label>
        <label class="ft-check"><input v-model="advanced" type="checkbox" /> Show advanced</label>
        <!-- Added after opening: the trap still includes them (queried on every Tab). -->
        <template v-if="advanced">
          <label class="ft-field">Handle <input value="@ada" /></label>
          <label class="ft-field">Website <input type="url" value="https://example.com" /></label>
        </template>
        <div class="demo-row ft-actions">
          <button type="button" class="btn" @click="close">Cancel</button>
          <button type="button" class="btn btn-primary" @click="save">Save</button>
        </div>
        <p class="ft-hint">Tab / Shift+Tab cycle inside. Escape closes and returns focus.</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ft-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgb(0 0 0 / 0.45);
}
.ft-dialog {
  width: min(420px, 100%);
  display: grid;
  gap: 10px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 20px 50px rgb(0 0 0 / 0.3);
}
.ft-title {
  margin: 0;
  font-size: 1.1rem;
}
.ft-field {
  display: grid;
  gap: 4px;
}
.ft-field input {
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
}
.ft-check {
  display: flex;
  gap: 6px;
  align-items: center;
}
.ft-dialog :focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.ft-actions {
  justify-content: flex-end;
}
.ft-hint {
  margin: 0;
  color: var(--muted);
  font-size: 0.8125rem;
}
</style>
