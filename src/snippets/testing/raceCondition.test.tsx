import { expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';

function Results({ query, search }: { query: string; search: (q: string) => Promise<string> }) {
  const [text, setText] = useState('');
  useEffect(() => {
    let stale = false; // ignore responses for superseded queries
    void search(query).then((r) => { if (!stale) setText(r); });
    return () => { stale = true; };
  }, [query, search]);
  return <output>{text}</output>;
}

it('the latest request wins even if an earlier one resolves last', async () => {
  // One deferred promise per call: the test decides WHEN and in WHAT ORDER they settle.
  const pending = new Map<string, PromiseWithResolvers<string>>();
  const search = (q: string) => {
    const d = Promise.withResolvers<string>();
    pending.set(q, d);
    return d.promise;
  };
  const { rerender } = render(<Results query="re" search={search} />);
  rerender(<Results query="react" search={search} />);

  await act(async () => pending.get('react')?.resolve('results for react'));
  expect(screen.getByRole('status')).toHaveTextContent('results for react');

  // Without the `stale` flag this late response would overwrite the newer one.
  await act(async () => pending.get('re')?.resolve('results for re'));
  expect(screen.getByRole('status')).toHaveTextContent('results for react');
});

