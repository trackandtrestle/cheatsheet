import type { Key, ReactNode } from 'react';

export interface ListProps<T> {
  items: readonly T[];
  getKey: (item: T) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  empty?: ReactNode;
}

// T is inferred from `items`; getKey / renderItem are checked against it.
export function List<T>({ items, getKey, renderItem, empty = 'Nothing here' }: ListProps<T>) {
  if (items.length === 0) return <p>{empty}</p>;
  return (
    <ul>
      {items.map((item, index) => (
        <li key={getKey(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Arrow-function form in .tsx: `<T,>` (the comma disambiguates from JSX).
export const Count = <T,>({ items }: { items: readonly T[] }) => <span>{items.length}</span>;
