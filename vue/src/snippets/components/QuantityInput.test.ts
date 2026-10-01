import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import QuantityInput from './QuantityInput.vue';

describe('defineModel', () => {
  it('two-way binds with the parent via v-model', async () => {
    const user = userEvent.setup();
    const qty = ref(2);
    // Equivalent of <QuantityInput v-model="qty" :max="3" />
    const Host = defineComponent(() => () =>
      h(QuantityInput, { modelValue: qty.value, 'onUpdate:modelValue': (v: number) => (qty.value = v), max: 3 }),
    );
    render(Host);

    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(qty.value).toBe(3);
    expect(screen.getByRole('status')).toHaveTextContent('3');
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('falls back to local state (the default) when no v-model is bound', async () => {
    const user = userEvent.setup();
    render(QuantityInput);
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByRole('status')).toHaveTextContent('2');
  });
});
