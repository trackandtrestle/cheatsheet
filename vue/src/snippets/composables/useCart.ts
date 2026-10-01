import { computed, readonly, ref } from 'vue';

export interface CartLine {
  sku: string;
  qty: number;
}

// Module scope = ONE instance shared by every component that calls useCart().
// (Move these two lines inside useCart() and each caller gets private state.)
const lines = ref<CartLine[]>([]);
const count = computed(() => lines.value.reduce((n, l) => n + l.qty, 0));

export function useCart() {
  function add(sku: string, qty = 1) {
    const line = lines.value.find((l) => l.sku === sku);
    if (line) line.qty += qty;
    else lines.value.push({ sku, qty });
  }
  function remove(sku: string) {
    lines.value = lines.value.filter((l) => l.sku !== sku);
  }
  // Expose read-only state + named mutations so changes are traceable.
  return { lines: readonly(lines), count, add, remove };
}

/** Escape hatch for tests: module state otherwise leaks between them. */
export function resetCart() {
  lines.value = [];
}
