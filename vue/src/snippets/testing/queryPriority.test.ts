import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h } from 'vue';

const SignupForm = defineComponent(() => () =>
  h('form', { 'aria-label': 'Sign up' }, [
    h('label', { for: 'email' }, 'Email'),
    h('input', { id: 'email', type: 'email', placeholder: 'you@example.com' }),
    h('p', 'We never share your address.'),
    h('button', { type: 'submit' }, 'Create account'),
    h('span', { 'data-testid': 'spinner', hidden: true }),
  ]),
);

// Query like a user would, most accessible first:
// 1. getByRole(role, { name })   – accessibility tree; also asserts semantics
// 2. getByLabelText              – form fields
// 3. getByPlaceholderText        – only if there is no label (fix that!)
// 4. getByText                   – non-interactive text
// 5. getByTestId                 – last resort, invisible to users
describe('query priority', () => {
  it('prefers role + accessible name', () => {
    render(SignupForm);
    expect(screen.getByRole('form', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeEnabled();
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
  });

  it('falls back to label, text, then test id', () => {
    render(SignupForm);
    expect(screen.getByLabelText('Email')).toBe(screen.getByPlaceholderText('you@example.com'));
    expect(screen.getByText(/never share/)).toBeInTheDocument();
    // `hidden` elements are excluded from *ByRole but not from *ByTestId.
    expect(screen.getByTestId('spinner')).not.toBeVisible();
  });
});
