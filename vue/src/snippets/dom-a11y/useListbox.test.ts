import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import { nextIndex, useListbox } from './useListbox';

const SIZES = ['Small', 'Medium', 'Large', 'Mega', 'XL'] as const;
const Sizes = defineComponent(() => {
  const size = ref<(typeof SIZES)[number]>('Medium');
  const { listboxAttrs, optionAttrs } = useListbox(SIZES, size);
  return () => h('ul', { 'aria-label': 'Size', ...listboxAttrs.value },
    SIZES.map((s, i) => h('li', { key: s, ...optionAttrs(i) }, s)));
});

describe('nextIndex', () => {
  it('maps keys to a clamped index', () => {
    expect(nextIndex('ArrowDown', 4, 5)).toBe(4); // no wrap
    expect(nextIndex('ArrowUp', 0, 5)).toBe(0);
    expect(nextIndex('End', 1, 5)).toBe(4);
    expect(nextIndex('x', 1, 5)).toBeNull();
  });
});

describe('useListbox', () => {
  it('is one tab stop; arrows, Home/End and type-ahead move the selection', async () => {
    const user = userEvent.setup();
    render(Sizes);
    await user.tab();
    const listbox = screen.getByRole('listbox', { name: 'Size' });
    expect(listbox).toHaveFocus();
    const selected = () => screen.getByRole('option', { selected: true });

    await user.keyboard('{ArrowDown}');
    expect(selected()).toHaveTextContent('Large');
    expect(listbox).toHaveAttribute('aria-activedescendant', selected().id);
    await user.keyboard('{Home}');
    expect(selected()).toHaveTextContent('Small');
    await user.keyboard('m');
    expect(selected()).toHaveTextContent('Medium');
    await user.keyboard('m'); // repeated letter cycles through matches
    expect(selected()).toHaveTextContent('Mega');
    await user.keyboard('{End}');
    expect(selected()).toHaveTextContent('XL');
    await user.click(screen.getByRole('option', { name: 'Small' }));
    expect(selected()).toHaveTextContent('Small');
  });
});
