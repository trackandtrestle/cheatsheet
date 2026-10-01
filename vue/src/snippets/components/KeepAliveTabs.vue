<script setup lang="ts">
import { computed, ref, type Component } from 'vue';

interface Tab {
  id: string;
  label: string;
  // Pass components as plain/markRaw values; never make them deeply reactive.
  component: Component;
}

const { tabs } = defineProps<{ tabs: readonly Tab[] }>();
const activeId = ref(tabs[0]?.id);
const active = computed(() => tabs.find((t) => t.id === activeId.value));
</script>

<template>
  <div role="tablist" aria-label="Sections" class="demo-row">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="btn btn-small"
      :aria-selected="tab.id === activeId"
      @click="activeId = tab.id"
    >
      {{ tab.label }}
    </button>
  </div>
  <div role="tabpanel" :aria-label="active?.label">
    <!-- Inactive panels are cached (deactivated), not unmounted: state survives. -->
    <KeepAlive v-if="active" :max="10">
      <component :is="active.component" />
    </KeepAlive>
  </div>
</template>
