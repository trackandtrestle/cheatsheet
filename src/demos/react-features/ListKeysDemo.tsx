import { useId } from 'react';
import { KeyedList, type Item } from '../../snippets/react-features/ListKeys';

const ITEMS: Item[] = [
  { id: 'a', label: 'Apples' },
  { id: 'b', label: 'Bread' },
  { id: 'c', label: 'Cheese' },
];

export function ListKeysDemo() {
  const id = useId();
  return (
    <div>
      <p className="mono">Type a note next to Apples in both lists, then press Reverse.</p>
      <div className="demo-row" style={{ alignItems: 'flex-start' }}>
        <section aria-labelledby={`${id}-id`}>
          <h4 id={`${id}-id`}>key=&#123;item.id&#125;</h4>
          <KeyedList initial={ITEMS} />
        </section>
        <section aria-labelledby={`${id}-index`}>
          <h4 id={`${id}-index`}>key=&#123;index&#125; (broken)</h4>
          <KeyedList initial={ITEMS} indexKeys />
        </section>
      </div>
    </div>
  );
}
