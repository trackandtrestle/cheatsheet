<script setup lang="ts">
import { reactive } from 'vue';
import { useSearchLog } from '../../snippets/reactivity/watchVsWatchEffect';

const entries = reactive<{ id: number; text: string }[]>([]);
let nextId = 0;
// unshift/splice don't track reads, so logging from inside watchEffect can't loop.
const push = (text: string) => {
  entries.unshift({ id: nextId++, text });
  entries.splice(8);
};

// Watchers created during setup are stopped automatically on unmount.
const { query, page } = useSearchLog(push);
</script>

<template>
  <div class="demo-row">
    <label>
      Query <input v-model="query" type="search" autocomplete="off" />
    </label>
    <button type="button" class="btn btn-small" @click="page++">page++ ({{ page }})</button>
    <button type="button" class="btn btn-small" @click="entries.splice(0)">Clear log</button>
  </div>
  <ol class="log mono" aria-live="polite" aria-label="Watcher log, newest first">
    <li v-for="e in entries" :key="e.id" :class="e.text.startsWith('watch') ? 'is-watch' : ''">
      {{ e.text }}
    </li>
  </ol>
</template>

<style scoped>
.log {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  font-size: 13px;
}
.log li {
  padding: 2px 8px;
  border-left: 3px solid var(--border);
}
.log li.is-watch {
  border-left-color: var(--accent);
  background: var(--accent-soft);
}
</style>
