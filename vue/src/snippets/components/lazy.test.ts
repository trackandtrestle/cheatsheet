import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { flushPromises } from '@vue/test-utils';
import { defineComponent, h, type Component } from 'vue';

const renderIn = (C: Component) => render(defineComponent(() => () => h('div', h(C))));
import { lazy } from './lazy';

const Chart = defineComponent(() => () => h('p', 'Chart ready'));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('defineAsyncComponent', () => {
  it('shows the loading component only after `delay`, then the real one', async () => {
    const { promise, resolve } = Promise.withResolvers<Component>();
    renderIn(lazy(() => promise));
    expect(screen.queryByRole('status')).toBeNull();

    await vi.advanceTimersByTimeAsync(200);
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');

    resolve(Chart);
    await flushPromises();
    expect(screen.getByText('Chart ready')).toBeInTheDocument();
  });

  it('retries, then renders the error component', async () => {
    const loader = vi.fn(() => Promise.reject(new Error('offline')));
    renderIn(lazy(loader, 1));
    await vi.runAllTimersAsync();
    await flushPromises();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load: offline');
  });
});
