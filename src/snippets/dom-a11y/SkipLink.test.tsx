import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton, Layout } from './SkipLink';

describe('skip link & visually hidden', () => {
  it('skip link is the first tab stop and targets a focusable <main>', async () => {
    const user = userEvent.setup();
    render(<Layout nav={<nav><a href="/a">A</a><a href="/b">B</a></nav>}><p>Body</p></Layout>);
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#main');
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabindex', '-1');
    main.focus(); // jsdom doesn't follow fragment links; a browser focuses #main
    expect(main).toHaveFocus();
  });

  it('visually hidden text still names the control', async () => {
    const onClick = vi.fn();
    render(<IconButton label="Close" icon="✕" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Close' }); // not "✕"
    await userEvent.setup().click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
