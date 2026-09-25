import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';

function User({ id }: { id: number }) {
  const [state, setState] = useState<string>('loading');
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => (r.ok ? r.json() as Promise<{ name: string }> : Promise.reject(new Error(r.statusText))))
      .then((u) => setState(u.name), (e: Error) => setState(`error: ${e.message}`));
  }, [id]);
  return <p>{state}</p>;
}

describe('mocking fetch', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // undoes spyOn…
    vi.unstubAllGlobals(); // …but NOT stubGlobal
  });

  it('spyOn(globalThis, "fetch") with a real Response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ name: 'Ada' }));
    render(<User id={1} />);
    expect(await screen.findByText('Ada')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('/api/users/1');
  });

  it('vi.stubGlobal for error paths', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 404, statusText: 'Not Found' })));
    render(<User id={2} />);
    expect(await screen.findByText('error: Not Found')).toBeInTheDocument();
  });
});
