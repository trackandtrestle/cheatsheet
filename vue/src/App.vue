<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { refDebounced } from './lib/refDebounced';
import { ENTRIES, SECTIONS } from './content';
import type { Entry, SectionId } from './content/types';
import EntryCard from './components/EntryCard.vue';
import SearchBar from './components/SearchBar.vue';
import SideNav from './components/SideNav.vue';
import { buildIndex, search } from './lib/search';
import { useHash } from './lib/useHash';
import { useTheme } from './lib/useTheme';

const props = withDefaults(defineProps<{ entries?: readonly Entry[] }>(), { entries: () => ENTRIES });

const { theme, toggle } = useTheme();
const query = ref('');
// Typing stays responsive while 100+ cards filter: search a briefly debounced copy.
const settledQuery = refDebounced(query, 60);
const navOpen = ref(false);
const hash = useHash();
const searchBar = useTemplateRef<InstanceType<typeof SearchBar>>('searchBar');
const navToggle = useTemplateRef<HTMLButtonElement>('navToggle');

const index = computed(() => buildIndex(props.entries));
const results = computed(() => search(index.value, settledQuery.value));
const grouped = computed(() => Map.groupBy(results.value, (e) => e.section));
const counts = computed(() => {
  const c = {} as Record<SectionId, number>;
  for (const s of SECTIONS) c[s.id] = grouped.value.get(s.id)?.length ?? 0;
  return c;
});

// "/" focuses search from anywhere that isn't already a text field; Escape closes the mobile nav.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && navOpen.value) {
    navOpen.value = false;
    navToggle.value?.focus();
    return;
  }
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  e.preventDefault();
  searchBar.value?.focus();
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));

// Deep link: clear a search that hides the target, then scroll to and focus it.
watch(
  [hash, results],
  async ([h]) => {
    if (!h) return;
    const isEntry = props.entries.some((e) => e.id === h);
    if (isEntry && !results.value.some((e) => e.id === h)) {
      query.value = '';
      settledQuery.flush();
      return;
    }
    await nextTick();
    const el = document.getElementById(h);
    el?.scrollIntoView?.({ block: 'start' });
    if (isEntry) el?.focus({ preventScroll: true });
  },
  { immediate: true },
);
</script>

<template>
  <div class="app">
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="topbar">
      <button
        ref="navToggle"
        type="button"
        class="btn nav-toggle"
        :aria-expanded="navOpen"
        aria-controls="sidebar"
        @click="navOpen = !navOpen"
      >
        <span aria-hidden="true">☰</span>
        <span class="visually-hidden">Sections</span>
      </button>
      <h1 class="brand"><a href="#">Vue 3 Cheat Sheet</a></h1>
      <SearchBar ref="searchBar" v-model="query" :result-count="results.length" :total="entries.length" />
      <button
        type="button"
        class="btn theme-toggle"
        :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
        @click="toggle"
      >
        <span aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span>
      </button>
    </header>

    <div class="layout">
      <SideNav :open="navOpen" :counts="counts" @navigate="navOpen = false" />
      <main id="main" class="content" tabindex="-1">
        <p v-if="results.length === 0" class="empty">
          No entries match <strong>“{{ settledQuery }}”</strong>.
          <button type="button" class="btn btn-small" @click="query = ''">Clear search</button>
        </p>
        <template v-for="section in SECTIONS" :key="section.id">
          <section
            v-if="grouped.get(section.id)"
            :id="`section-${section.id}`"
            class="section"
            :aria-labelledby="`h-${section.id}`"
          >
            <h2 :id="`h-${section.id}`">
              {{ section.title }} <span class="count">{{ grouped.get(section.id)?.length }}</span>
            </h2>
            <p v-if="!settledQuery" class="blurb">{{ section.blurb }}</p>
            <EntryCard
              v-for="entry in grouped.get(section.id)"
              :key="entry.id"
              :entry="entry"
              :active="entry.id === hash"
            />
          </section>
        </template>
      </main>
    </div>
  </div>
</template>
