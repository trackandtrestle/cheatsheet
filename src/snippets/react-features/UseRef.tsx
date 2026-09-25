import { useEffect, useRef, useState } from 'react';

export function Stopwatch() {
  const [ticks, setTicks] = useState(0);
  // A ref is a mutable box: writing .current never triggers a re-render.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (timer.current !== null) return; // already running
    timer.current = setInterval(() => setTicks((t) => t + 1), 1000);
  };
  const stop = () => {
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => () => stop(), []); // clear on unmount

  return (
    <div>
      <output aria-label="ticks">{ticks}</output>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// DOM ref: React sets .current to the element after commit.
export function FocusableSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input ref={inputRef} type="search" aria-label="Search" />
      <button onClick={() => inputRef.current?.focus()}>Focus search</button>
    </div>
  );
}
