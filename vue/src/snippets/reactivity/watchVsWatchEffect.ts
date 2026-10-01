import { ref, watch, watchEffect } from 'vue';

export function useSearchLog(log: (msg: string) => void) {
  const query = ref('');
  const page = ref(1);

  // watchEffect: runs IMMEDIATELY and tracks whatever it reads (query AND page).
  watchEffect(() => {
    log(`effect: "${query.value}" page ${page.value}`);
  });

  // watch: LAZY, explicit source (only query), gets new and old values.
  watch(query, (next, prev) => {
    log(`watch: "${prev}" -> "${next}"`);
  });

  return { query, page };
}
