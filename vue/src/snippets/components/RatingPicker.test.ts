import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import RatingPicker from './RatingPicker.vue';

describe('defineEmits (tuple syntax)', () => {
  it('emits typed payloads', async () => {
    const user = userEvent.setup();
    const { emitted } = render(RatingPicker, { props: { max: 3 } });

    await user.click(screen.getByRole('button', { name: '2 of 3' }));
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(emitted('rate')).toEqual([[2]]);
    expect(emitted('clear')).toEqual([[]]);
  });

  it('a declared emit is not a fallthrough attr: the parent listener runs once', async () => {
    const user = userEvent.setup();
    let calls = 0;
    render(RatingPicker, { props: { max: 1 }, attrs: { onClear: () => calls++ } });
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(calls).toBe(1);
  });
});
