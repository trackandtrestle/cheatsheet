import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import ErrorBoundary from './ErrorBoundary.vue';

const broken = ref(true);
const Flaky = defineComponent(() => () => {
  if (broken.value) throw new Error('boom');
  return h('p', 'All good');
});

describe('onErrorCaptured error boundary', () => {
  it('renders the fallback, reports the error and recovers on reset', async () => {
    const { emitted } = render(ErrorBoundary, { slots: { default: () => h(Flaky) } });

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong: boom');
    expect(emitted<[Error]>('error')[0]?.[0]).toBeInstanceOf(Error);

    broken.value = false;
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('catches errors thrown in child event handlers too', async () => {
    const Thrower = defineComponent(() => () =>
      h('button', { onClick: () => { throw new Error('click failed'); } }, 'Explode'),
    );
    render(ErrorBoundary, { slots: { default: () => h(Thrower) } });
    await userEvent.click(screen.getByRole('button', { name: 'Explode' }));
    expect(screen.getByRole('alert')).toHaveTextContent('click failed');
  });
});
