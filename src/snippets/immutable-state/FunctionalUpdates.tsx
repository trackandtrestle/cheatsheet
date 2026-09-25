import { useState } from 'react';

// Each setCount(count + 1) reads the SAME stale `count` from this render.
export function StaleCounter() {
  const [count, setCount] = useState(0);
  const addThree = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1); // result: +1, not +3
  };
  return (
    <button type="button" className="btn" onClick={addThree}>
      Stale +3: {count}
    </button>
  );
}

// Updater functions are queued and each receives the latest pending state.
export function QueuedCounter() {
  const [count, setCount] = useState(0);
  const addThree = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1); // result: +3
  };
  return (
    <button type="button" className="btn" onClick={addThree}>
      Functional +3: {count}
    </button>
  );
}
