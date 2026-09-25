/**
 * Trailing debounce: run `fn` once, `wait` ms after the LAST call in a burst.
 * Classic use: search-as-you-type, autosave, resize end.
 */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: A): void => {
    clearTimeout(timer); // every call restarts the countdown
    timer = setTimeout(() => fn(...args), wait);
  };
}

// Usage
// const save = debounce((draft: string) => api.save(draft), 500);
// input.addEventListener('input', (e) => save((e.target as HTMLInputElement).value));
