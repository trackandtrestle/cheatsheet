<script setup lang="ts">
import { nextTick, shallowRef, useId, useTemplateRef } from 'vue';
import { useOnClickOutside } from '../../snippets/composables/useOnClickOutside';

const options = ['Small', 'Medium', 'Large'] as const;
const open = shallowRef(false);
const picked = shallowRef<(typeof options)[number]>('Medium');
const root = useTemplateRef<HTMLElement>('root');
const trigger = useTemplateRef<HTMLButtonElement>('trigger');
const menuId = useId();

useOnClickOutside(root, () => (open.value = false));

async function choose(option: (typeof options)[number]) {
  picked.value = option;
  open.value = false;
  await nextTick();
  trigger.value?.focus();
}
function onEscape() {
  open.value = false;
  trigger.value?.focus();
}
</script>

<template>
  <div class="demo-row">
    <div ref="root" class="dd" @keydown.esc="onEscape">
      <button
        ref="trigger"
        type="button"
        class="btn"
        :aria-expanded="open"
        :aria-controls="menuId"
        @click="open = !open"
      >
        Size: {{ picked }} ▾
      </button>
      <ul v-show="open" :id="menuId" class="dd-panel">
        <li v-for="o in options" :key="o">
          <button type="button" class="btn btn-small" :aria-pressed="o === picked" @click="choose(o)">
            {{ o }}
          </button>
        </li>
      </ul>
    </div>
    <button type="button" class="btn btn-small">Something else</button>
  </div>
  <p class="hint">Click elsewhere, press Esc, or Tab past the panel to close it.</p>
</template>

<style scoped>
.dd {
  position: relative;
}
.dd-panel {
  position: absolute;
  z-index: 5;
  top: calc(100% + 4px);
  left: 0;
  margin: 0;
  padding: 6px;
  list-style: none;
  display: grid;
  gap: 4px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  min-width: 100%;
}
.dd-panel .btn {
  width: 100%;
  text-align: left;
}
.hint {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
}
</style>
