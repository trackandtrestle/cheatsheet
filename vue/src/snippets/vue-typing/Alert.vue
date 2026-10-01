<script setup lang="ts">
interface Action {
  label: string;
  run: () => void;
}

// Props can be an interface (also imported from another file, 3.3+).
interface Props {
  title: string; // required
  tone?: 'info' | 'success' | 'danger'; // union literal: autocomplete + checked
  dismissible?: boolean; // absent boolean -> false (Boolean casting)
  actions?: Action[];
}

// withDefaults: non-primitive defaults MUST be factories, or every
// instance shares (and can mutate) the same array.
const props = withDefaults(defineProps<Props>(), {
  tone: 'info',
  actions: () => [],
});

defineEmits<{ dismiss: [] }>();
</script>

<template>
  <div :class="['alert', `alert-${props.tone}`]" :role="props.tone === 'danger' ? 'alert' : 'status'">
    <strong>{{ title }}</strong>
    <button v-for="a in actions" :key="a.label" type="button" class="btn btn-small" @click="a.run()">
      {{ a.label }}
    </button>
    <button v-if="dismissible" type="button" aria-label="Dismiss" @click="$emit('dismiss')">×</button>
  </div>
</template>
