import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import DataState from './DataState.vue';

type Slots = InstanceType<typeof DataState>['$slots'];

describe('defineSlots', () => {
  it('types slot names and slot props', () => {
    expectTypeOf<Parameters<NonNullable<Slots['error']>>[0]>().toEqualTypeOf<{ error: Error; message: string }>();
    expectTypeOf<Slots['loading']>().toEqualTypeOf<(() => unknown) | undefined>();
  });

  it('renders the slot matching the status, with slot props', () => {
    render(DataState, {
      props: { status: 'error', error: new Error('404') },
      slots: { error: ({ message }: { message: string }) => h('p', `Oops: ${message}`), default: () => 'Data' },
    });
    expect(screen.getByText('Oops: 404')).toBeInTheDocument();
    expect(screen.queryByText('Data')).toBeNull();
  });

  it('falls back to default slot content', () => {
    render(DataState, { props: { status: 'loading' }, slots: { default: () => 'Data' } });
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
  });
});
