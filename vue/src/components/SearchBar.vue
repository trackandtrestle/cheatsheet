<script setup lang="ts">
import { useTemplateRef } from 'vue';

defineProps<{ resultCount: number; total: number }>();
const query = defineModel<string>({ required: true });
const input = useTemplateRef<HTMLInputElement>('input');

function onEscape(e: KeyboardEvent) {
  if (query.value) query.value = '';
  else (e.currentTarget as HTMLInputElement).blur();
}

defineExpose({
  focus: () => {
    input.value?.focus();
    input.value?.select();
  },
});
</script>

<template>
  <form class="search" role="search" @submit.prevent>
    <label for="search-input" class="visually-hidden">Search entries</label>
    <input
      id="search-input"
      ref="input"
      v-model="query"
      type="search"
      placeholder="Search… (press / )"
      autocomplete="off"
      spellcheck="false"
      aria-describedby="search-status"
      @keydown.escape="onEscape"
    />
    <kbd class="search-kbd" aria-hidden="true">/</kbd>
    <span id="search-status" class="search-status" role="status">
      {{ query ? `${resultCount} of ${total} entries` : '' }}
    </span>
  </form>
</template>
