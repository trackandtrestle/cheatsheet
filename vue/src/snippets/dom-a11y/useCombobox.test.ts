import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { computed, defineComponent, h, mergeProps, ref } from 'vue';
import { useCombobox } from './useCombobox';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Cherry'];
const onSelect = vi.fn<(v: string) => void>();
const Fruit = defineComponent(() => {
  const query = ref('');
  const matches = computed(() => FRUITS.filter((f) => f.toLowerCase().startsWith(query.value.toLowerCase())));
  const cb = useCombobox(matches, (v) => { query.value = v; onSelect(v); });
  return () => [
    h('label', { for: 'fruit' }, 'Fruit'),
    // mergeProps chains both onInput handlers (what v-model + v-bind do in a template)
    h('input', mergeProps(cb.inputAttrs.value, { id: 'fruit', value: query.value,
      onInput: (e: Event) => (query.value = (e.target as HTMLInputElement).value) })),
    h('ul', cb.listboxAttrs.value, matches.value.map((f, i) => h('li', { key: f, ...cb.optionAttrs(i) }, f))),
  ];
});

describe('useCombobox', () => {
  it('filters, navigates with arrows via aria-activedescendant, selects with Enter', async () => {
    const user = userEvent.setup();
    render(Fruit);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await user.type(input, 'ap');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    const apricot = screen.getByRole('option', { name: 'Apricot' });
    expect(input).toHaveAttribute('aria-activedescendant', apricot.id);
    expect(apricot).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveFocus(); // DOM focus never moved

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('Apricot');
    expect(input).toHaveValue('Apricot');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); // hidden when closed
  });

  it('wraps upward, closes on Escape, keeps focus on option click', async () => {
    const user = userEvent.setup();
    render(Fruit);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Cherry' }).id);
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{ArrowDown}');
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(input).toHaveValue('Banana');
    expect(input).toHaveFocus();
  });
});
