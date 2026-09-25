import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps, SubmitEventHandler } from 'react';
import { SignupForm } from './FormSubmit';

describe('SubmitEvent + FormData', () => {
  it('validates and submits typed data', async () => {
    const user = userEvent.setup();
    const onSignup = vi.fn();
    render(<SignupForm onSignup={onSignup} />);
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a plan');

    await user.click(screen.getByRole('radio', { name: 'Pro' }));
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(onSignup).toHaveBeenCalledWith({ email: 'ada@example.com', plan: 'pro' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('types FormData values loosely', () => {
    expectTypeOf(new FormData().get('x')).toEqualTypeOf<FormDataEntryValue | null>();
    expectTypeOf<ComponentProps<'form'>['onSubmit']>().toEqualTypeOf<
      SubmitEventHandler<HTMLFormElement> | undefined
    >();
  });
});
