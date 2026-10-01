<script setup lang="ts">
import { computed } from 'vue';
import { useLocalStorage } from '../../snippets/composables/useLocalStorage';

interface Draft {
  name: string;
  plan: 'free' | 'pro';
  newsletter: boolean;
}
const initial: Draft = { name: '', plan: 'free', newsletter: false };
const draft = useLocalStorage<Draft>('cheatsheet-demo-draft', { ...initial });
const stored = computed(() => JSON.stringify(draft.value));

function reset() {
  draft.value = { ...initial };
}
</script>

<template>
  <form class="ls-form" @submit.prevent>
    <div class="demo-row">
      <label>Name <input v-model="draft.name" type="text" autocomplete="off" /></label>
      <label>
        Plan
        <select v-model="draft.plan">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </label>
      <label><input v-model="draft.newsletter" type="checkbox" /> Newsletter</label>
      <button type="button" class="btn btn-small" @click="reset">Reset</button>
    </div>
    <p class="hint">Reload the page (or open it in a second tab and type there): the draft survives and syncs.</p>
    <output class="mono">localStorage = {{ stored }}</output>
  </form>
</template>

<style scoped>
.ls-form {
  display: grid;
  gap: 8px;
}
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
</style>
