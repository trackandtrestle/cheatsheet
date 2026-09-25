import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Search({ onSubmit }: { onSubmit: (q: string) => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget).get('q') as string); }}>
      <input name="q" aria-label="Query" />
      <button type="submit">Go</button>
    </form>
  );
}

describe('userEvent', () => {
  it('simulates a real user: focus, keydown, input, keyup, click', async () => {
    const user = userEvent.setup(); // call before render; one per test
    const onSubmit = vi.fn();
    render(<Search onSubmit={onSubmit} />);

    await user.tab(); // focus moves like the browser's Tab key
    expect(screen.getByLabelText('Query')).toHaveFocus();
    await user.keyboard('react{Backspace}{Backspace}'); // special keys in {}
    await user.type(screen.getByLabelText('Query'), 'lly{Enter}'); // Enter submits
    expect(onSubmit).toHaveBeenLastCalledWith('really');

    await user.clear(screen.getByLabelText('Query'));
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenLastCalledWith('');
  });

  it('fireEvent dispatches ONE synthetic event — no focus, no keystrokes', () => {
    render(<Search onSubmit={vi.fn()} />);
    const input = screen.getByLabelText('Query');
    fireEvent.change(input, { target: { value: 'x' } });
    expect(input).toHaveValue('x');
    expect(input).not.toHaveFocus(); // a real user would have focused it
  });
});
