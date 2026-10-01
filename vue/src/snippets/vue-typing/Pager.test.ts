import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Pager from './Pager.vue';

type Props = InstanceType<typeof Pager>['$props'];

describe('typing defineModel', () => {
  it('generates typed model props and update events', () => {
    expectTypeOf<Props['page']>().toEqualTypeOf<number>(); // required: true
    expectTypeOf<Props['pageSize']>().toEqualTypeOf<10 | 25 | 50 | undefined>();
    expectTypeOf<Parameters<NonNullable<Props['onUpdate:pageSize']>>[0]>().toEqualTypeOf<10 | 25 | 50>();
    // @ts-expect-error 20 is not an allowed page size
    const bad: Props = { page: 1, total: 100, pageSize: 20 };
    expect(bad).toBeTruthy();
  });

  it('writes through the model refs', async () => {
    const user = userEvent.setup();
    const { emitted } = render(Pager, { props: { page: 1, total: 100 } });
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.selectOptions(screen.getByLabelText('Page size'), '50');
    expect(emitted('update:page')).toEqual([[2]]);
    expect(emitted('update:pageSize')).toEqual([[50]]);
    // No update listener bound here, so the models fall back to local state.
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });
});
