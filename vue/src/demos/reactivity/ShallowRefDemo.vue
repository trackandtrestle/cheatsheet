<script setup lang="ts">
import { computed } from 'vue';
import { useRows } from '../../snippets/reactivity/shallowRef';

const { rows, toggle, toggleInPlace, forceUpdate } = useRows([
  { id: 1, done: false },
  { id: 2, done: false },
  { id: 3, done: false },
]);
const doneCount = computed(() => rows.value.filter((r) => r.done).length);
</script>

<template>
  <p>
    Rendered: <strong class="mono">{{ doneCount }} / {{ rows.length }}</strong> done
  </p>
  <ul class="rows">
    <li v-for="r in rows" :key="r.id" class="demo-row">
      <span class="mono">#{{ r.id }} {{ r.done ? '✓' : '·' }}</span>
      <button type="button" class="btn btn-small" @click="toggle(r.id)">Replace (tracked)</button>
      <button type="button" class="btn btn-small" @click="toggleInPlace(r.id)">
        Mutate in place (silent)
      </button>
    </li>
  </ul>
  <button type="button" class="btn btn-primary" @click="forceUpdate">triggerRef(rows)</button>
</template>

<style scoped>
.rows {
  list-style: none;
  padding: 0;
  margin: 8px 0 12px;
  display: grid;
  gap: 6px;
}
</style>
