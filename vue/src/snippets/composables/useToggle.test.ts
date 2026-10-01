import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { useToggle } from './useToggle';

const Toggle = defineComponent({
  setup() {
    const [on, toggle] = useToggle();
    // like `@click="toggle"` in a template: the MouseEvent is passed through
    return () => [
      h('button', { 'aria-pressed': on.value, onClick: toggle }, 'Bold'),
      h('button', { onClick: () => toggle(false) }, 'Off'),
    ];
  },
});

describe('useToggle', () => {
  it('flips on click (event arg ignored) and accepts an explicit value', async () => {
    render(Toggle);
    const bold = screen.getByRole('button', { name: 'Bold' });
    await fireEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    await fireEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'false');
    await fireEvent.click(bold);
    await fireEvent.click(screen.getByRole('button', { name: 'Off' }));
    expect(bold).toHaveAttribute('aria-pressed', 'false');
  });
});
