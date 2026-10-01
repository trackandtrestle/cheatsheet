import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h } from 'vue';
import LabeledInput from './LabeledInput.vue';

describe('attribute fallthrough', () => {
  it('inheritAttrs: false + v-bind="$attrs" forwards attrs to the input', async () => {
    const onFocus = vi.fn();
    render(LabeledInput, {
      props: { label: 'Email' },
      attrs: { class: 'wide', placeholder: 'you@example.com', 'aria-invalid': 'true', onFocus },
    });
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('wide');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
    expect(input.closest('label')).not.toHaveClass('wide');
    expect(input.closest('label')).toHaveClass('invalid');

    await userEvent.click(input);
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('gotcha: an undeclared emit name falls through as a native listener and fires twice', async () => {
    const onClick = vi.fn();
    // No `emits: ['click']`, so onClick lands on the root <button> as well.
    const Leaky = defineComponent({
      setup: (_, { emit }) => () => h('button', { onClick: () => emit('click') }, 'Leaky'),
    });
    render(Leaky, { attrs: { onClick } });
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
