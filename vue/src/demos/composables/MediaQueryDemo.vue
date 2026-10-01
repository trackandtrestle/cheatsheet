<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { useMediaQuery, usePreferredDark, usePrefersReducedMotion } from '../../snippets/composables/useMediaQuery';

const query = shallowRef('(min-width: 900px)');
const matches = useMediaQuery(query);
const dark = usePreferredDark();
const reducedMotion = usePrefersReducedMotion();
const inputId = useId();
</script>

<template>
  <div class="demo-row">
    <label :for="inputId">Query</label>
    <input :id="inputId" v-model.trim="query" type="text" class="mq-input" spellcheck="false" />
    <output class="mono" aria-live="polite">matches: {{ matches }}</output>
  </div>
  <ul class="mq-list">
    <li>prefers-color-scheme: dark → <span class="mono">{{ dark }}</span></li>
    <li>prefers-reduced-motion → <span class="mono">{{ reducedMotion }}</span></li>
  </ul>
  <p class="hint">Resize the window or switch your OS theme; the values update live.</p>
</template>

<style scoped>
.mq-input {
  min-width: 16em;
  font-family: var(--mono);
}
.mq-list {
  margin: 10px 0 0;
  padding-left: 1.2em;
}
.hint {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
}
</style>
