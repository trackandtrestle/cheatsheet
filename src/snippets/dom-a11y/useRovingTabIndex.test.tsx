import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRovingTabIndex } from './useRovingTabIndex';

const TOOLS = ['Bold', 'Italic', 'Underline'];

function Toolbar() {
  const { getItemProps } = useRovingTabIndex(TOOLS.length);
  return (
    <>
      <div role="toolbar" aria-label="Formatting">
        {TOOLS.map((t, i) => <button key={t} {...getItemProps(i)}>{t}</button>)}
      </div>
      <button>After</button>
    </>
  );
}

describe('roving tabindex', () => {
  it('is a single tab stop; arrows move focus and wrap', async () => {
    const user = userEvent.setup();
    render(<Toolbar />);
    const [bold, italic, underline] = TOOLS.map((name) => screen.getByRole('button', { name }));

    await user.tab();
    expect(bold).toHaveFocus();
    await user.keyboard('{ArrowLeft}'); // wraps to the end
    expect(underline).toHaveFocus();
    expect(underline).toHaveAttribute('tabindex', '0');
    expect(bold).toHaveAttribute('tabindex', '-1');

    await user.tab(); // leaves the group in ONE Tab
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab({ shift: true }); // and returns to the last active item
    expect(underline).toHaveFocus();
    await user.keyboard('{Home}{ArrowRight}');
    expect(italic).toHaveFocus();
  });
});
