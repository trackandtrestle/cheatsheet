import { useToggleSet } from '../../snippets/immutable-state/useToggleSet';
import './demos.css';

const TAGS = ['react', 'typescript', 'testing', 'a11y', 'css'] as const;
type Tag = (typeof TAGS)[number];

export function TagToggleDemo() {
  const { selected, toggle, clear } = useToggleSet<Tag>(['react']);
  return (
    <div className="imm-demo">
      <div className="demo-row" role="group" aria-label="Filter tags">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="btn btn-small"
            aria-pressed={selected.has(tag)}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        ))}
        <button type="button" className="btn btn-small" onClick={clear}>
          Clear
        </button>
      </div>
      <p className="imm-status">
        Selected (<output aria-live="polite">{selected.size}</output>):{' '}
        <span className="mono">{selected.size ? [...selected].join(', ') : 'none'}</span>
      </p>
    </div>
  );
}
