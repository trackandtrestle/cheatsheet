import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import SelectList from './SelectList.vue';

interface Fruit {
  id: number;
  name: string;
  emoji: string;
}
const fruits: Fruit[] = [
  { id: 1, name: 'Apple', emoji: '🍎' },
  { id: 2, name: 'Pear', emoji: '🍐' },
];

// A generic SFC compiles to a generic function: its first parameter is the props.
type Props<T extends { id: string | number }> = Parameters<typeof SelectList<T>>[0];

describe('generic components', () => {
  it('binds T to the item type in props, model, emits and slot props', () => {
    expectTypeOf<Props<Fruit>['selected']>().toEqualTypeOf<number | null | undefined>();
    expectTypeOf<Parameters<NonNullable<Props<Fruit>['onPick']>>[0]>().toEqualTypeOf<Fruit>();
    // @ts-expect-error items must have an id
    type Bad = Props<{ name: string }>;
    expectTypeOf<Bad>().not.toBeNever();
  });

  it('renders the scoped slot and reports the picked item', async () => {
    const { emitted } = render(SelectList, {
      props: { items: fruits, label: 'Fruit' },
      slots: { default: ({ item }: { item: Fruit }) => h('span', `${item.emoji} ${item.name}`) },
    });
    await userEvent.click(screen.getByRole('button', { name: '🍐 Pear' }));
    expect(screen.getByRole('button', { name: '🍐 Pear' })).toHaveAttribute('aria-pressed', 'true');
    expect(emitted('pick')).toEqual([[fruits[1]]]);
    expect(emitted('update:selected')).toEqual([[2]]);
  });
});
