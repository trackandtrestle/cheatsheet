<script setup lang="ts">
import { computed } from 'vue';

const { total } = defineProps<{ total: number }>();

// Each defineModel adds a prop + an `update:<name>` event with the same type.
const page = defineModel<number>('page', { required: true });
const pageSize = defineModel<10 | 25 | 50>('pageSize', { default: 10 });

const pageCount = computed(() => Math.max(1, Math.ceil(total / pageSize.value)));
</script>

<template>
  <nav aria-label="Pagination" class="demo-row">
    <button type="button" class="btn btn-small" :disabled="page <= 1" @click="page--">Previous</button>
    <span class="mono">{{ page }} / {{ pageCount }}</span>
    <button type="button" class="btn btn-small" :disabled="page >= pageCount" @click="page++">Next</button>
    <select v-model.number="pageSize" aria-label="Page size">
      <option v-for="n in [10, 25, 50] as const" :key="n" :value="n">{{ n }}</option>
    </select>
  </nav>
</template>
