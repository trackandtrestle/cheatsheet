import { useState } from 'react';

export function parseDraft(raw: string | null): string[] {
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

export function DraftList({ load }: { load: () => string | null }) {
  // Bad:  useState(parseDraft(load()))  -> load() + parse run on EVERY render
  // Good: pass a function; React calls it once, on mount.
  const [items, setItems] = useState(() => parseDraft(load()));

  return (
    <div>
      <p>{items.length} items</p>
      <button onClick={() => setItems((prev) => [...prev, `item ${prev.length + 1}`])}>
        Add
      </button>
    </div>
  );
}
