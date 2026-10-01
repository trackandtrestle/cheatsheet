<script setup lang="ts">
import { ref, useId } from 'vue';
import { useListbox } from '../../snippets/dom-a11y/useListbox';

const TIMEZONES = ['Auckland', 'Berlin', 'Bogotá', 'Cairo', 'Chicago', 'Denver', 'London', 'Lima', 'Tokyo', 'Toronto'] as const;
type Zone = (typeof TIMEZONES)[number];
const zone = ref<Zone>('London');
const { listboxAttrs, optionAttrs } = useListbox(TIMEZONES, zone);
const labelId = useId();
</script>

<template>
  <div class="lb">
    <p :id="labelId" class="lb-label">Time zone <span class="lb-hint">(Tab in, then ↑ ↓ Home End or type a letter)</span></p>
    <ul v-bind="listboxAttrs" :aria-labelledby="labelId" class="lb-list">
      <li v-for="(z, i) in TIMEZONES" :key="z" v-bind="optionAttrs(i)" class="lb-option">{{ z }}</li>
    </ul>
    <p class="mono">Selected: {{ zone }}</p>
  </div>
</template>

<style scoped>
.lb {
  display: grid;
  gap: 6px;
  max-width: 320px;
}
.lb-label {
  margin: 0;
  font-weight: 600;
}
.lb-hint {
  font-weight: 400;
  color: var(--muted);
  font-size: 0.875rem;
}
.lb-list {
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.lb-list:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.lb-option {
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.lb-option:hover {
  background: var(--surface-2);
}
.lb-option[aria-selected='true'] {
  background: var(--accent-soft);
  font-weight: 600;
}
</style>
