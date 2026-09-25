import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  // Every call reads the same `count` snapshot from this render -> net +1.
  const addThreeStale = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  // Updaters are queued and each receives the latest pending value -> +3.
  const addThree = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div>
      <output aria-label="count">{count}</output>
      <button onClick={addThreeStale}>stale +3</button>
      <button onClick={addThree}>updater +3</button>
    </div>
  );
}
