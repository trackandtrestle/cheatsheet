import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';

function Page() {
  return (
    <>
      <nav aria-label="Main"><a href="/">Home</a><a href="/docs">Docs</a></nav>
      <footer><a href="/">Home</a></footer>
      <details><summary>More</summary><p>Collapsed text</p></details>
      <p style={{ display: 'none' }}>Hidden text</p>
    </>
  );
}

describe('within, debugging, presence vs visibility', () => {
  it('scopes queries to a container with within()', () => {
    render(<Page />);
    // screen.getByRole('link', { name: 'Home' }) would throw: two matches.
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getAllByRole('link')).toHaveLength(2);
    expect(within(screen.getByRole('contentinfo')).getByRole('link')).toHaveAttribute('href', '/');
  });

  it('toBeInTheDocument ≠ toBeVisible', () => {
    render(<Page />);
    // screen.debug();                 -> pretty-prints the DOM (or pass an element)
    // logRoles(container)             -> every role + name; `import { logRoles }`
    // screen.logTestingPlaygroundURL() -> suggests the best query in a browser
    const hidden = screen.getByText('Hidden text');
    expect(hidden).toBeInTheDocument(); // it's in the DOM…
    expect(hidden).not.toBeVisible(); //  …but display:none (also checks ancestors)
    expect(screen.getByText('Collapsed text')).not.toBeVisible(); // closed <details>
  });
});
