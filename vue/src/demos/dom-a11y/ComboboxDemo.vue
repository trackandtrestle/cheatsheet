<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import { useCombobox } from '../../snippets/dom-a11y/useCombobox';

const LANGUAGES = ['TypeScript', 'JavaScript', 'Rust', 'Ruby', 'Python', 'Go', 'Kotlin', 'Swift', 'Elixir', 'Haskell'];
const query = ref('');
const picked = ref<string | null>(null);
const inputId = useId();
const matches = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q ? LANGUAGES.filter((l) => l.toLowerCase().includes(q)) : LANGUAGES;
});
const { active, expanded, inputAttrs, listboxAttrs, optionAttrs } = useCombobox(matches, (value) => {
  query.value = value;
  picked.value = value;
});

// The highlighted option has no real focus, so scroll it into view ourselves.
watch(active, (i) => {
  if (i < 0) return;
  document.getElementById(optionAttrs(i).id)?.scrollIntoView?.({ block: 'nearest' });
}, { flush: 'post' });
</script>

<template>
  <div class="combo">
    <label :for="inputId">Language</label>
    <input :id="inputId" v-model="query" v-bind="inputAttrs" class="combo-input" autocomplete="off" />
    <ul v-bind="listboxAttrs" class="combo-list" aria-label="Languages">
      <li v-for="(lang, i) in matches" :key="lang" v-bind="optionAttrs(i)" class="combo-option">{{ lang }}</li>
    </ul>
    <p class="combo-status" aria-live="polite">
      <template v-if="!expanded && query && matches.length === 0">No matches</template>
    </p>
    <p class="mono">Selected: {{ picked ?? '—' }}</p>
  </div>
</template>

<style scoped>
.combo {
  position: relative;
  display: grid;
  gap: 6px;
  max-width: 320px;
}
.combo-input {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font: inherit;
}
.combo-input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.combo-list {
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.combo-option {
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
}
.combo-option:hover {
  background: var(--surface-2);
}
.combo-option[aria-selected='true'] {
  background: var(--accent-soft);
  color: var(--text);
  outline: 1px solid var(--accent);
}
.combo-status {
  margin: 0;
  min-height: 1.2em;
  color: var(--muted);
  font-size: 0.875rem;
}
</style>
