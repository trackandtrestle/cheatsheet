<script setup lang="ts" generic="T extends { id: string | number }">
// T is inferred per usage from `items`; the constraint guarantees a usable key.
const { items, label } = defineProps<{ items: readonly T[]; label: string }>();
const selected = defineModel<T['id'] | null>('selected', { default: null });
const emit = defineEmits<{ pick: [item: T] }>();

defineSlots<{
  default(props: { item: T; selected: boolean }): unknown;
}>();

function pick(item: T) {
  selected.value = item.id;
  emit('pick', item);
}
</script>

<template>
  <ul :aria-label="label" class="select-list">
    <li v-for="item in items" :key="item.id">
      <button type="button" class="btn btn-small" :aria-pressed="item.id === selected" @click="pick(item)">
        <slot :item="item" :selected="item.id === selected" />
      </button>
    </li>
  </ul>
</template>
