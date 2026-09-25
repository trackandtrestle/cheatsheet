import { memo, useId, useState } from 'react';
import type { Entry } from '../content/types';
import { CodeBlock } from './CodeBlock';
import { CopyButton } from './CopyButton';
import { DemoBoundary } from './ErrorBoundary';
import { RichText } from './RichText';

interface EntryCardProps {
  entry: Entry;
  theme: 'light' | 'dark';
  active: boolean;
}

export const EntryCard = memo(function EntryCard({ entry, theme, active }: EntryCardProps) {
  const { id, title, summary, tags, snippet, gotchas, Demo } = entry;
  const [demoOpen, setDemoOpen] = useState(entry.demoOpen ?? false);
  const headingId = `${id}-title`;
  const demoId = useId();
  // Demos that open by default (the showcase) render above the code.
  const demoFirst = entry.demoOpen === true;

  const demo = Demo && (
    <section className="demo" aria-label={`Live demo: ${title}`}>
      <button
        type="button"
        className="btn btn-small"
        aria-expanded={demoOpen}
        aria-controls={demoId}
        onClick={() => setDemoOpen((o) => !o)}
      >
        {demoOpen ? 'Hide live demo' : 'Show live demo'}
      </button>
      <div id={demoId} className="demo-body" hidden={!demoOpen}>
        {demoOpen && (
          <DemoBoundary
            fallback={(err, reset) => (
              <div role="alert" className="demo-error">
                Demo crashed: {err.message}{' '}
                <button type="button" className="btn btn-small" onClick={reset}>
                  Retry
                </button>
              </div>
            )}
          >
            <Demo />
          </DemoBoundary>
        )}
      </div>
    </section>
  );

  return (
    <article id={id} className={`card${active ? ' card-active' : ''}`} aria-labelledby={headingId} tabIndex={-1}>
      <header className="card-head">
        <h3>
          <a href={`#${id}`} className="anchor" aria-label={`Link to ${title}`}>
            #
          </a>
          <span id={headingId}>{title}</span>
        </h3>
        <ul className="tags" aria-label="Tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </header>
      <p className="summary">
        <RichText text={summary} />
      </p>

      {demoFirst && demo}

      <div className="code-wrap">
        <CopyButton text={snippet} label={`Copy code for ${title}`} />
        <CodeBlock code={snippet} theme={theme} />
      </div>

      {gotchas && gotchas.length > 0 && (
        <details className="gotchas">
          <summary>
            Gotchas <span className="count">{gotchas.length}</span>
          </summary>
          <ul>
            {gotchas.map((g) => (
              <li key={g}>
                <RichText text={g} />
              </li>
            ))}
          </ul>
        </details>
      )}

      {!demoFirst && demo}
    </article>
  );
});
