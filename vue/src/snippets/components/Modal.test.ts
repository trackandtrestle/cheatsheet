import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import Modal from './Modal.vue';

function renderModal(inline = false) {
  const open = ref(false);
  // <main><button @click="open = true">Open</button><Modal v-model:open="open" …>Body</Modal></main>
  const Host = defineComponent(() => () =>
    h('main', { 'data-testid': 'host' }, [
      h('button', { onClick: () => (open.value = true) }, 'Open'),
      h(Modal, { title: 'Settings', inline, open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v) }, () => 'Body'),
    ]),
  );
  render(Host);
  return open;
}

describe('Teleport', () => {
  it('renders into <body>, outside the host DOM, and focuses the dialog', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(screen.getByTestId('host')).not.toContainElement(dialog);
    expect(dialog.closest('body > .modal-backdrop')).not.toBeNull();
    expect(dialog).toHaveFocus();
  });

  it('disabled renders in place', async () => {
    renderModal(true);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByTestId('host')).toContainElement(screen.getByRole('dialog'));
  });

  it('closes on Escape and via v-model', async () => {
    const open = renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('{Escape}');
    expect(open.value).toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
