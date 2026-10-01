import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import Field from './Field.vue';

describe('useId label wiring', () => {
  it('gives each instance its own id for label / description / error', () => {
    const Form = defineComponent(() => () => [
      h(Field, { label: 'Email', hint: 'We never share it' }),
      h(Field, { label: 'Password', error: 'Too short' }),
    ]);
    render(Form);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    expect(email.id).not.toBe(password.id);
    expect(email).toHaveAccessibleDescription('We never share it');
    expect(password).toBeInvalid();
    expect(password).toHaveAccessibleErrorMessage('Too short');
  });
});
