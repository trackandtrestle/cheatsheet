import { TransitionFilter } from '../../snippets/react-features/TransitionFilter';

const ITEMS = Array.from({ length: 20_000 }, (_, i) => `Item ${i + 1}`);

export function TransitionFilterDemo() {
  return (
    <div>
      <p className="mono">20,000 items; type quickly: the input never lags.</p>
      <TransitionFilter items={ITEMS} />
    </div>
  );
}
