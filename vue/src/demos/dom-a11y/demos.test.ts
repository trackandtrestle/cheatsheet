import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import ComboboxDemo from './ComboboxDemo.vue';
import ListboxDemo from './ListboxDemo.vue';
import FocusTrapDemo from './FocusTrapDemo.vue';
import RovingToolbarDemo from './RovingToolbarDemo.vue';

describe('dom-a11y demos (smoke)', () => {
  it('combobox selects with the keyboard', async () => {
    const user = userEvent.setup();
    render(ComboboxDemo);
    await user.type(screen.getByRole('combobox', { name: 'Language' }), 'ru{ArrowDown}{Enter}');
    expect(screen.getByText('Selected: Rust')).toBeInTheDocument();
  });

  it('listbox moves selection with arrows', async () => {
    const user = userEvent.setup();
    render(ListboxDemo);
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Selected: Lima')).toBeInTheDocument();
  });

  it('focus-trap modal opens, saves and restores focus', async () => {
    const user = userEvent.setup();
    render(FocusTrapDemo);
    const opener = screen.getByRole('button', { name: 'Edit profile' });
    await user.click(opener);
    expect(await screen.findByRole('textbox', { name: 'Name' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(opener).toHaveFocus();
    expect(screen.getByText('Saved: Ada Lovelace')).toBeInTheDocument();
  });

  it('toolbar toggles with the keyboard', async () => {
    const user = userEvent.setup();
    render(RovingToolbarDemo);
    await user.tab();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
  });
});
