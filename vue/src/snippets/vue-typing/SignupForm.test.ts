import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SignupForm from './SignupForm.vue';

type Props = InstanceType<typeof SignupForm>['$props'];

afterEach(() => vi.restoreAllMocks());

describe('typing emits with payload validation', () => {
  it('derives typed listener props from the emits', () => {
    type OnSubmit = NonNullable<Props['onSubmit']>;
    expectTypeOf<Parameters<OnSubmit>>().toEqualTypeOf<[payload: { email: string; plan: 'free' | 'pro' }]>();
    expectTypeOf<Parameters<NonNullable<Props['onCancel']>>>().toEqualTypeOf<[]>();
  });

  it('emits a valid payload', async () => {
    const user = userEvent.setup();
    const { emitted } = render(SignupForm);
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.selectOptions(screen.getByLabelText('Plan'), 'pro');
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(emitted('submit')).toEqual([[{ email: 'ada@example.com', plan: 'pro' }]]);
  });

  it('warns (dev only) on an invalid payload but still emits', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const user = userEvent.setup();
    const { emitted } = render(SignupForm);
    await user.type(screen.getByLabelText('Email'), 'nope');
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid event arguments'));
    expect(emitted('submit')).toHaveLength(1);
  });
});
