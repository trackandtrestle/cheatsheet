import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';

//             0 match   1 match   >1 match   async?
// getBy       throw     element   throw      no
// queryBy     null      element   throw      no
// findBy      reject    element   reject     yes (retries up to 1000 ms)
// getAllBy    throw     [el]      [els]      no
// queryAllBy  []        [el]      [els]      no
// findAllBy   reject    [el]      [els]      yes
function Notice() {
  const [ready, setReady] = useState(false);
  useEffect(() => void setTimeout(() => setReady(true), 50), []);
  return ready ? <p role="status">Saved</p> : <p>Saving…</p>;
}

describe('getBy vs queryBy vs findBy', () => {
  it('getBy throws, queryBy returns null, findBy waits', async () => {
    render(<Notice />);
    expect(() => screen.getByRole('status')).toThrow(/unable to find/i);
    expect(screen.queryByRole('status')).not.toBeInTheDocument(); // assert absence
    expect(await screen.findByRole('status')).toHaveTextContent('Saved');
  });

  it('*AllBy returns arrays; getBy throws on multiple matches', () => {
    render(<ul><li>a</li><li>b</li></ul>);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(() => screen.getByRole('listitem')).toThrow(/multiple elements/i);
    expect(screen.queryAllByRole('row')).toEqual([]);
  });
});
