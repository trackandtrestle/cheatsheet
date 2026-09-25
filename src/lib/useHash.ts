import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const getHash = () => decodeURIComponent(window.location.hash.slice(1));

/** Current `location.hash` without the leading `#`. */
export function useHash(): string {
  return useSyncExternalStore(subscribe, getHash, () => '');
}
