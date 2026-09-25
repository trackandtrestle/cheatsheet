export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

// Aborts reject with a DOMException named 'AbortError' (or your custom reason).
// Check the name, not `instanceof Error`: DOMException may come from another realm.
export function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError';
}

// One controller per request; abort() cancels the network call itself.
export function searchUsers(query: string) {
  const controller = new AbortController();
  const result = fetchJson<string[]>(`/api/users?q=${encodeURIComponent(query)}`, controller.signal);
  return { result, abort: () => controller.abort() };
}
