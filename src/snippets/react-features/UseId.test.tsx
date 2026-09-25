import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Field } from './UseId';

const Form = () => (
  <>
    <Field label="Email" hint="We never share it." />
    <Field label="Name" hint="As on your passport." />
  </>
);

describe('useId', () => {
  afterEach(() => vi.restoreAllMocks());

  it('wires unique label and description ids per instance', () => {
    render(<Form />);
    const email = screen.getByRole('textbox', { name: 'Email' });
    const name = screen.getByRole('textbox', { name: 'Name' });
    expect(email.id).not.toBe(name.id);
    expect(email).toHaveAccessibleDescription('We never share it.');
    expect(name).toHaveAccessibleDescription('As on your passport.');
  });

  it('hydrates server HTML without id mismatches', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(<Form />);
    const serverId = container.querySelector('input')?.id;
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onRecoverableError = vi.fn();

    const root = await act(async () => hydrateRoot(container, <Form />, { onRecoverableError }));
    expect(container.querySelector('input')?.id).toBe(serverId);
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(errors).not.toHaveBeenCalled();
    act(() => root.unmount());
  });
});
