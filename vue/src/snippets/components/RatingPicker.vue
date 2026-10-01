<script setup lang="ts">
const { max = 5 } = defineProps<{ max?: number }>();

// Tuple syntax (3.3+): event name -> labelled payload tuple.
const emit = defineEmits<{
  rate: [value: number];
  clear: [];
}>();
</script>

<template>
  <div role="group" aria-label="Rating">
    <button
      v-for="n in max"
      :key="n"
      type="button"
      class="btn btn-small"
      :aria-label="`${n} of ${max}`"
      @click="emit('rate', n)"
    >
      {{ n }}
    </button>
    <button type="button" class="btn btn-small" @click="emit('clear')">Clear</button>
  </div>
</template>
