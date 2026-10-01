<script setup lang="ts">
import { markRaw } from 'vue';
import KeepAliveTabs from '../../snippets/components/KeepAliveTabs.vue';
import CounterPanel from './CounterPanel.vue';
import NotesPanel from './NotesPanel.vue';

// markRaw: component definitions should never be made reactive.
const tabs = [
  { id: 'counter', label: 'Counter', component: markRaw(CounterPanel) },
  { id: 'notes', label: 'Notes', component: markRaw(NotesPanel) },
];
</script>

<template>
  <KeepAliveTabs :tabs="tabs" />
</template>
