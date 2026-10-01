import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import type { ComponentInstance } from 'vue';
import FocusInput from './FocusInput.vue';
import LoginForm from './LoginForm.vue';

type Exposed = InstanceType<typeof FocusInput>;

describe('typing template refs to components', () => {
  it('types the exposed API (refs are unwrapped on the instance)', () => {
    expectTypeOf<Exposed['focus']>().toEqualTypeOf<() => void>();
    expectTypeOf<Exposed['isEmpty']>().toEqualTypeOf<boolean>();
    expectTypeOf<ComponentInstance<typeof FocusInput>['isEmpty']>().toEqualTypeOf<boolean>();
  });

  it('calls the exposed focus() from the parent', async () => {
    render(LoginForm);
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });
});
