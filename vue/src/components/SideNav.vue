<script setup lang="ts">
import { SECTIONS } from '../content/sections';
import type { SectionId } from '../content/types';

defineProps<{ open: boolean; counts: Record<SectionId, number> }>();
const emit = defineEmits<{ navigate: [] }>();
</script>

<template>
  <nav id="sidebar" class="sidebar" :class="{ open }" aria-label="Sections">
    <ul>
      <li v-for="s in SECTIONS" :key="s.id">
        <a v-if="counts[s.id] > 0" :href="`#section-${s.id}`" @click="emit('navigate')">
          <span>{{ s.title }}</span>
          <span class="count">{{ counts[s.id] }}</span>
        </a>
        <span v-else class="nav-empty" aria-disabled="true">
          <span>{{ s.title }}</span>
          <span class="count">0</span>
        </span>
      </li>
    </ul>
  </nav>
</template>
