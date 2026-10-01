<script setup lang="ts">
import { ref } from 'vue';
import { useRovingTabIndex } from '../../snippets/dom-a11y/useRovingTabIndex';

type Format = 'bold' | 'italic' | 'underline' | 'strike';
const TOOLS: { id: Format; label: string; glyph: string }[] = [
  { id: 'bold', label: 'Bold', glyph: 'B' },
  { id: 'italic', label: 'Italic', glyph: 'I' },
  { id: 'underline', label: 'Underline', glyph: 'U' },
  { id: 'strike', label: 'Strikethrough', glyph: 'S' },
];
const on = ref(new Set<Format>(['bold']));
const toggle = (f: Format) => {
  const next = new Set(on.value);
  if (!next.delete(f)) next.add(f);
  on.value = next;
};
const { containerAttrs, itemAttrs } = useRovingTabIndex();
</script>

<template>
  <div class="rt">
    <div role="toolbar" aria-label="Text formatting" v-bind="containerAttrs" class="rt-bar">
      <button
        v-for="(tool, i) in TOOLS"
        :key="tool.id"
        type="button"
        class="btn rt-btn"
        :class="`rt-${tool.id}`"
        :aria-label="tool.label"
        :aria-pressed="on.has(tool.id)"
        v-bind="itemAttrs(i)"
        @click="toggle(tool.id)"
      >{{ tool.glyph }}</button>
    </div>
    <p class="rt-preview" :class="[...on].map((f) => `rt-${f}`)">The quick brown fox jumps over the lazy dog.</p>
    <p class="rt-hint">Tab into the toolbar, use ← → Home End, Space/Enter toggles. One Tab leaves it.</p>
  </div>
</template>

<style scoped>
.rt {
  display: grid;
  gap: 10px;
}
.rt-bar {
  display: inline-flex;
  gap: 4px;
  width: fit-content;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-2);
}
.rt-btn {
  min-width: 36px;
  font-family: Georgia, serif;
}
.rt-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.rt-preview {
  margin: 0;
  padding: 10px 12px;
  border: 1px dashed var(--border);
  border-radius: 8px;
}
.rt-bold {
  font-weight: 700;
}
.rt-italic {
  font-style: italic;
}
.rt-underline {
  text-decoration: underline;
}
.rt-strike {
  text-decoration: line-through;
}
.rt-underline.rt-strike {
  text-decoration: underline line-through;
}
.rt-hint {
  margin: 0;
  color: var(--muted);
  font-size: 0.8125rem;
}
</style>
