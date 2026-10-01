<script setup lang="ts">
import { ref } from 'vue';

interface Item {
  id: string;
  label: string;
}

const { initial, indexKeys = false } = defineProps<{ initial: Item[]; indexKeys?: boolean }>();
const items = ref([...initial]);
</script>

<template>
  <button type="button" class="btn btn-small" @click="items.reverse()">Reverse</button>
  <ul>
    <!-- Index key: Vue patches rows in place by position, so the typed (DOM)
         value stays put while labels move. A stable id moves the element. -->
    <li v-for="(item, i) in items" :key="indexKeys ? i : item.id">
      <input :aria-label="`Note for ${item.label}`" :placeholder="item.label" />
    </li>
  </ul>
</template>
