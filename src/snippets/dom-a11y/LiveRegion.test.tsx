import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartButton } from './LiveRegion';

describe('live regions', () => {
  it('regions exist (empty) before the content changes', async () => {
    const user = userEvent.setup();
    render(<CartButton />);
    const status = screen.getByRole('status');
    const alert = screen.getByRole('alert');
    expect(status).toBeEmptyDOMElement(); // present from the first render

    await user.click(screen.getByRole('button', { name: 'Add to cart' }));
    await expect.poll(() => status.textContent).toBe('Added to cart. 1 item.');
    expect(screen.getByRole('status')).toBe(status); // same node: text changed in place

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));
    expect(alert).toHaveTextContent('Limit reached');
  });
});
