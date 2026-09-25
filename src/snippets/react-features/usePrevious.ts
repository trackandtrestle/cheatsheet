import { useState } from 'react';

// Returns the previous *different* value. Uses the "adjust state during render"
// pattern, so it's correct under concurrent rendering and never reads a ref in render.
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  if (!Object.is(value, current)) {
    setPrevious(current); // React re-runs this render immediately, before painting
    setCurrent(value);
  }
  return previous;
}
