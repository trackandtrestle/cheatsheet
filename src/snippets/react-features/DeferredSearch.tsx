import { memo, useDeferredValue, useState } from 'react';

// memo is required: the list must be able to skip renders for the urgent pass.
const SlowList = memo(function SlowList(props: { query: string; items: readonly string[] }) {
  const q = props.query.toLowerCase();
  const visible = props.items.filter((item) => item.toLowerCase().includes(q));
  return <ul>{visible.slice(0, 50).map((item) => <li key={item}>{item}</li>)}</ul>;
});

export function DeferredSearch({ items }: { items: readonly string[] }) {
  const [query, setQuery] = useState('');
  // Lags behind `query`; React re-renders with it in the background.
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input type="search" aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div aria-busy={isStale} style={{ opacity: isStale ? 0.6 : 1 }}>
        <SlowList query={deferredQuery} items={items} />
      </div>
    </div>
  );
}
