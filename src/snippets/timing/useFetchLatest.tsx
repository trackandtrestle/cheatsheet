import { useEffect, useState } from 'react';

type State<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };

// `load` must be stable (module-level or useCallback), or the effect re-runs every render.
export function useFetchLatest<T>(key: string, load: (key: string, signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<State<T>>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false; // guards loaders that ignore the signal / already resolved
    setState({ status: 'loading' });
    load(key, controller.signal).then(
      (data) => !ignore && setState({ status: 'success', data }),
      (error: unknown) => !ignore && setState({ status: 'error', error }),
    );
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [key, load]);

  return state;
}

export function UserName(props: { id: string; load: (id: string, signal: AbortSignal) => Promise<string> }) {
  const state = useFetchLatest(props.id, props.load);
  if (state.status === 'loading') return <p>Loading…</p>;
  if (state.status === 'error') return <p role="alert">Could not load user</p>;
  return <p>{state.data}</p>;
}
