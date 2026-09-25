import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import type { Entry } from './content/types';

const DemoWidget = () => <p>demo is alive</p>;

const entries: Entry[] = [
  {
    id: 'timing-debounce',
    section: 'timing',
    title: 'Debounce',
    summary: 'Wait for quiet.',
    tags: ['debounce'],
    snippet: 'export const debounce = 1;',
    gotchas: ['Beware stale closures.'],
    Demo: DemoWidget,
  },
  {
    id: 'arrays-sort',
    section: 'arrays',
    title: 'Numeric sort',
    summary: 'Pass a comparator.',
    tags: ['sort'],
    snippet: '[1, 10, 2].sort((a, b) => a - b);',
  },
];

afterEach(() => {
  window.location.hash = '';
});

describe('App shell', () => {
  it('renders sections and cards', () => {
    render(<App entries={entries} />);
    expect(screen.getByRole('heading', { level: 2, name: /timing/i })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Debounce' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Numeric sort' })).toBeInTheDocument();
  });

  it('"/" focuses the search box, and search filters entries', async () => {
    const user = userEvent.setup();
    render(<App entries={entries} />);
    await user.keyboard('/');
    const box = screen.getByRole('searchbox', { name: /search entries/i });
    expect(box).toHaveFocus();
    await user.type(box, 'comparator');
    expect(await screen.findByText('1 of 2 entries')).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Debounce' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('article', { name: 'Debounce' })).toBeInTheDocument();
  });

  it('searches code', async () => {
    const user = userEvent.setup();
    render(<App entries={entries} />);
    await user.type(screen.getByRole('searchbox'), 'a - b');
    expect(await screen.findByRole('article', { name: 'Numeric sort' })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Debounce' })).not.toBeInTheDocument();
  });

  it('toggles gotchas and the live demo', async () => {
    const user = userEvent.setup();
    render(<App entries={entries} />);
    const card = screen.getByRole('article', { name: 'Debounce' });
    await user.click(within(card).getByText(/gotchas/i));
    expect(within(card).getByText('Beware stale closures.')).toBeVisible();
    const toggle = within(card).getByRole('button', { name: /show live demo/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(within(card).getByText('demo is alive')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('marks the hash-targeted entry active and clears a hiding search', async () => {
    const user = userEvent.setup();
    render(<App entries={entries} />);
    await user.type(screen.getByRole('searchbox'), 'comparator');
    await screen.findByText('1 of 2 entries');
    act(() => {
      window.location.hash = '#timing-debounce';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    const card = await screen.findByRole('article', { name: 'Debounce' });
    expect(card).toHaveClass('card-active');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('copies code to the clipboard', async () => {
    const user = userEvent.setup();
    render(<App entries={entries} />);
    await user.click(screen.getByRole('button', { name: 'Copy code for Numeric sort' }));
    expect(await navigator.clipboard.readText()).toBe('[1, 10, 2].sort((a, b) => a - b);');
    expect(screen.getByText('Copied to clipboard')).toBeInTheDocument();
  });
});
