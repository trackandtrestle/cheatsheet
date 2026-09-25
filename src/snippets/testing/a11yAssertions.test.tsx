import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useId, useState } from 'react';

function Disclosure({ title, children }: { title: string; children: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <button aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <svg aria-hidden="true" width="8" height="8" /> {title}
      </button>
      <div id={id} hidden={!open}>{children}</div>
      <input aria-label="Email" aria-describedby={`${id}-hint`} aria-invalid="true" />
      <span id={`${id}-hint`}>Must contain @</span>
    </>
  );
}

describe('accessibility assertions', () => {
  it('asserts names, descriptions and ARIA state', async () => {
    render(<Disclosure title="Details">Body</Disclosure>);
    const button = screen.getByRole('button', { name: 'Details' });

    expect(button).toHaveAccessibleName('Details'); // aria-hidden icon is excluded
    expect(button).toHaveAttribute('aria-expanded', 'false'); // string, not boolean
    await userEvent.setup().click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Body')).toBeVisible();

    const email = screen.getByRole('textbox', { name: 'Email' });
    expect(email).toHaveAccessibleDescription('Must contain @');
    expect(email).toBeInvalid();
  });
});
