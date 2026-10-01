import { describe, expect, it } from 'vitest';
import { computed, isReactive, reactive } from 'vue';
import { ChartInstance, useDashboard } from './markRaw';

describe('markRaw / shallowReactive', () => {
  it('keeps marked values raw inside reactive state', () => {
    const { state } = useDashboard(['NL', 'FR']);
    expect(isReactive(state)).toBe(true);
    expect(isReactive(state.chart)).toBe(false);
    expect(isReactive(state.countries)).toBe(false);
    expect(state.chart.add(1)).toBe(1); // #private works
  });

  it('a proxied class with #private fields throws', () => {
    const proxied = reactive(new ChartInstance());
    expect(() => proxied.add(1)).toThrow(TypeError);
  });

  it('shallowReactive tracks only the top level', () => {
    const { panel } = useDashboard([]);
    const title = computed(() => panel.title);
    panel.title = 'Revenue';
    expect(title.value).toBe('Revenue');
    expect(isReactive(panel.options)).toBe(false);
  });
});
