<script setup lang="ts">
import { computed, ref } from 'vue';
import SelectList from '../../snippets/vue-typing/SelectList.vue';

interface Fruit {
  id: number;
  name: string;
  emoji: string;
  price: number;
}

const fruits: Fruit[] = [
  { id: 1, name: 'Apple', emoji: '🍎', price: 0.5 },
  { id: 2, name: 'Pear', emoji: '🍐', price: 0.75 },
  { id: 3, name: 'Cherries', emoji: '🍒', price: 3 },
];

const selectedId = ref<number | null>(null); // T['id'] = number, inferred from :items
const lastPicked = ref<Fruit | null>(null);
const selected = computed(() => fruits.find((f) => f.id === selectedId.value));
</script>

<template>
  <SelectList v-model:selected="selectedId" :items="fruits" label="Fruit" @pick="lastPicked = $event">
    <!-- `item` is typed as Fruit here: try item.nope in your editor -->
    <template #default="{ item, selected: isSelected }">
      {{ item.emoji }} {{ item.name }} <span v-if="isSelected" aria-hidden="true">✓</span>
    </template>
  </SelectList>
  <p class="mono" aria-live="polite">
    selected id: {{ selectedId ?? 'null' }}<template v-if="selected"> · ${{ selected.price.toFixed(2) }}</template>
    <template v-if="lastPicked"> · last @pick: {{ lastPicked.name }}</template>
  </p>
</template>

<style scoped>
:deep(.select-list) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem;
}
:deep(.select-list [aria-pressed='true']) {
  background: var(--accent-soft);
  border-color: var(--accent);
}
</style>
