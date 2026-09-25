import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReorderTodosDemo } from './ReorderTodosDemo';
import { TagToggleDemo } from './TagToggleDemo';

const items = () =>
  within(screen.getByRole('list', { name: 'Todos' }))
    .getAllByRole('listitem')
    .map((li) => li.textContent?.replace(/[↑↓✕]/g, '').trim());

describe('immutable-state demos', () => {
  it('reorders, adds and removes todos', async () => {
    const user = userEvent.setup();
    render(<ReorderTodosDemo />);
    await user.click(screen.getByRole('button', { name: 'Move “Ship it” up' }));
    expect(items()).toEqual(['Write the helper', 'Ship it', 'Test the helper']);
    await user.click(screen.getByRole('button', { name: 'Move “Write the helper” up' })); // edge: no-op
    expect(items()[0]).toBe('Write the helper');
    await user.type(screen.getByLabelText('New todo'), 'Review{Enter}');
    expect(items()).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'Remove “Review”' }));
    expect(items()).toHaveLength(3);
    expect(screen.getByRole('status')).toHaveTextContent('Removed “Review”.');
  });

  it('toggles tags with aria-pressed', async () => {
    const user = userEvent.setup();
    render(<TagToggleDemo />);
    const ts = screen.getByRole('button', { name: 'typescript' });
    expect(ts).toHaveAttribute('aria-pressed', 'false');
    await user.click(ts);
    expect(ts).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('react, typescript')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByText('none')).toBeInTheDocument();
  });
});
