<script setup lang="ts">
import { ref, type Directive } from 'vue';

// In <script setup>, any `vCamelCase` variable is usable as a `v-camel-case` directive.
const vFocus: Directive<HTMLElement> = {
  mounted: (el) => el.focus(),
};

const name = defineModel<string>({ required: true });
const editing = ref(false);
</script>

<template>
  <input
    v-if="editing"
    v-model.trim="name"
    v-focus
    aria-label="Name"
    @keydown.enter="editing = false"
    @keydown.esc="editing = false"
  />
  <button v-else type="button" class="btn btn-small" @click="editing = true">
    {{ name }} ✎
  </button>
</template>
