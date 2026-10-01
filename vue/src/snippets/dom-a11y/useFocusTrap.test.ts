import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref, useTemplateRef } from 'vue';
import { useFocusTrap } from './useFocusTrap';

const App = defineComponent(() => {
  const open = ref(false);
  const extra = ref(false);
  const dialog = useTemplateRef<HTMLElement>('dialog');
  useFocusTrap(dialog, () => (open.value = false));
  return () => [
    h('button', { onClick: () => (open.value = true) }, 'Open'),
    open.value && h('div', { ref: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Edit' }, [
      h('input', { 'aria-label': 'Name' }),
      h('button', { onClick: () => (extra.value = true) }, 'More'),
      extra.value && h('button', 'Added later'),
    ]),
  ];
});

describe('useFocusTrap', () => {
  it('moves focus in, wraps Tab both ways, includes late elements, restores on Escape', async () => {
    const user = userEvent.setup();
    render(App);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);
    const name = await screen.findByRole('textbox', { name: 'Name' });
    expect(name).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'More' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'More' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Added later' })).toHaveFocus();
    await user.tab();
    expect(name).toHaveFocus(); // wrapped to the first element

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
