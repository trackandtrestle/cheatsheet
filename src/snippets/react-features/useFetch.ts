import { useEffect, useEffectEvent, useState } from 'react';

export type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// `parse` validates the unknown JSON into T (no blind `as T`).
export function useFetch<T>(url: string | null, parse: (json: unknown) => T): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' });
  const onParse = useEffectEvent(parse); // latest parser, not a dependency

  useEffect(() => {
    if (url === null) {
      setState({ status: 'idle' });
      return;
    }
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((json) => {
        if (!controller.signal.aborted) setState({ status: 'success', data: onParse(json) });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return; // superseded or unmounted: ignore
        setState({ status: 'error', error: err instanceof Error ? err : new Error(String(err)) });
      });
    return () => controller.abort(); // cancels the stale request on url change
  }, [url]);

  return state;
}
