import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h } from 'vue';
import { useRovingTabIndex } from './useRovingTabIndex';

const TOOLS = ['Bold', 'Italic', 'Underline'];
const Toolbar = defineComponent(() => {
  const { containerAttrs, itemAttrs } = useRovingTabIndex();
  return () => [
    h('div', { role: 'toolbar', 'aria-label': 'Format', ...containerAttrs.value },
      TOOLS.map((t, i) => h('button', { key: t, type: 'button', ...itemAttrs(i) }, t))),
    h('button', 'After'),
  ];
});

describe('useRovingTabIndex', () => {
  it('makes the group a single tab stop and moves focus with arrows', async () => {
    const user = userEvent.setup();
    render(Toolbar);
    const btn = (name: string) => screen.getByRole('button', { name });

    await user.tab();
    expect(btn('Bold')).toHaveFocus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(btn('Underline')).toHaveFocus();
    expect(btn('Underline')).toHaveAttribute('tabindex', '0');
    expect(btn('Bold')).toHaveAttribute('tabindex', '-1');
    await user.keyboard('{ArrowRight}'); // wraps
    expect(btn('Bold')).toHaveFocus();
    await user.keyboard('{End}');
    expect(btn('Underline')).toHaveFocus();

    await user.tab(); // leaves the toolbar in ONE Tab
    expect(btn('After')).toHaveFocus();
    await user.tab({ shift: true }); // and comes back to the last active item
    expect(btn('Underline')).toHaveFocus();
    await user.click(btn('Italic'));
    expect(btn('Italic')).toHaveAttribute('tabindex', '0');
  });
});
