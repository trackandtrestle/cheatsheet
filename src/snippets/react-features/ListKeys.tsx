import { useState } from 'react';

export interface Item { id: string; label: string }

// Each row owns state (here: the uncontrolled input's DOM value).
function Row({ label }: { label: string }) {
  return (
    <li>
      <input aria-label={`Note for ${label}`} placeholder={`Note for ${label}`} />
    </li>
  );
}

export function KeyedList({ initial, indexKeys = false }: { initial: Item[]; indexKeys?: boolean }) {
  const [items, setItems] = useState(initial);
  return (
    <div>
      <button className="btn btn-small" onClick={() => setItems((xs) => xs.toReversed())}>
        Reverse
      </button>
      <ul>
        {items.map((item, i) => (
          // index key: React matches rows by position, so state stays put while
          // the labels move. A stable id makes the state move with the item.
          <Row key={indexKeys ? i : item.id} label={item.label} />
        ))}
      </ul>
    </div>
  );
}
