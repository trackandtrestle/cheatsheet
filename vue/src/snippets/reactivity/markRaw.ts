import { markRaw, reactive, shallowReactive } from 'vue';

// A third-party-style class with true private state: proxying it breaks `#private` access.
export class ChartInstance {
  #points: number[] = [];
  add(point: number) {
    this.#points.push(point);
    return this.#points.length;
  }
}

export function useDashboard(countries: readonly string[]) {
  const state = reactive({
    filter: '',
    chart: markRaw(new ChartInstance()), // never proxied: identity and #private fields intact
    countries: markRaw([...countries]), // big immutable data: skip deep conversion
  });

  // shallowReactive: only top-level keys are reactive; nested objects stay plain.
  const panel = shallowReactive({ title: 'Sales', options: { stacked: false } });

  return { state, panel };
}
