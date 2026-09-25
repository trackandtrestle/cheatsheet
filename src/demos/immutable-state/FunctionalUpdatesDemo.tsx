import { QueuedCounter, StaleCounter } from '../../snippets/immutable-state/FunctionalUpdates';

export function FunctionalUpdatesDemo() {
  return (
    <div className="demo-row">
      <StaleCounter />
      <QueuedCounter />
    </div>
  );
}
