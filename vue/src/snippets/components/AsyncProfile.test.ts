import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, Suspense } from 'vue';
import AsyncProfile from './AsyncProfile.vue';

describe('Suspense + async setup', () => {
  it('shows the fallback until the async setup resolves', async () => {
    const { promise, resolve } = Promise.withResolvers<{ id: number; name: string }>();
    // Wrapped in an element: Suspense swaps branches inside its parent node.
    // <Suspense><AsyncProfile …/><template #fallback>Loading…</template></Suspense>
    const Host = defineComponent(() => () =>
      h('div', h(Suspense, null, {
        default: () => h(AsyncProfile, { id: 1, load: () => promise }),
        fallback: () => h('p', { role: 'status' }, 'Loading…'),
      })),
    );
    render(Host);
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');

    resolve({ id: 1, name: 'Ada' });
    expect(await screen.findByText('Signed in as Ada')).toBeInTheDocument();
    expect(screen.queryByRole('status')).toBeNull();
  });
});
