import { computed, ref } from 'vue';

export function useSearch(items: readonly string[]) {
  const query = ref('');
  let runs = 0; // instrumentation only, to show caching

  // Lazy: runs on first read. Cached: re-runs only after `query` changes AND it is read again.
  const matches = computed(() => {
    runs++;
    const q = query.value.trim().toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q));
  });

  // Prefer computed over a method in templates: a method re-runs on every render.
  const count = computed(() => matches.value.length);

  return { query, matches, count, runs: () => runs };
}
