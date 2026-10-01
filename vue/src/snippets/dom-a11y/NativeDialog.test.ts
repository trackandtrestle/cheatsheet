import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import NativeDialog from './NativeDialog.vue';

// jsdom has <dialog> but no showModal/close/returnValue: stub the behaviour we rely on.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement, value?: string) {
    if (!this.open) return;
    this.open = false;
    if (value !== undefined) this.returnValue = value;
    this.dispatchEvent(new Event('close'));
  });
});

describe('NativeDialog', () => {
  it('opens with showModal() and reports the returnValue on close', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const { rerender, emitted } = render(NativeDialog, {
      props: { title: 'Delete file?', open: false, 'onUpdate:open': onUpdate },
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // closed = not rendered

    await rerender({ open: true });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog', { name: 'Delete file?' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(emitted('close')).toEqual([['confirm']]);
    expect(onUpdate).toHaveBeenCalledWith(false);
  });

  it('Escape (native close event) syncs the model back', async () => {
    const onUpdate = vi.fn();
    render(NativeDialog, { props: { title: 'Hi', open: true, 'onUpdate:open': onUpdate } });
    const dialog = await screen.findByRole('dialog'); // showModal runs once the ref is set
    dialog.dispatchEvent(new Event('close')); // what the browser fires after Escape
    expect(onUpdate).toHaveBeenCalledWith(false);
  });
});
