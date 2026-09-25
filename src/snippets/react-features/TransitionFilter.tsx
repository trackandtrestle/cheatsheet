import { useMemo, useState, useTransition, type ChangeEvent } from 'react';

export function TransitionFilter({ items }: { items: readonly string[] }) {
  const [query, setQuery] = useState(''); // urgent: the input must stay responsive
  const [filter, setFilter] = useState(''); // non-urgent: drives the expensive list
  const [isPending, startTransition] = useTransition();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    startTransition(() => setFilter(e.target.value)); // interruptible render
  };

  const visible = useMemo(
    () => items.filter((item) => item.toLowerCase().includes(filter.toLowerCase())),
    [items, filter],
  );

  return (
    <div>
      <input type="search" aria-label="Filter items" value={query} onChange={onChange} />
      <p role="status">{isPending ? 'Updating…' : `${visible.length} matches`}</p>
      <ul aria-busy={isPending} style={{ opacity: isPending ? 0.6 : 1 }}>
        {visible.slice(0, 50).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
