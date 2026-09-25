import { useState } from 'react';
import { useRovingTabIndex } from '../../snippets/dom-a11y/useRovingTabIndex';
import './dom-a11y.css';

const TOOLS = ['Bold', 'Italic', 'Underline', 'Strike'] as const;
type Tool = (typeof TOOLS)[number];

export function RovingToolbarDemo() {
  const { active, getItemProps } = useRovingTabIndex(TOOLS.length);
  const [on, setOn] = useState<ReadonlySet<Tool>>(new Set());
  const toggle = (t: Tool) =>
    setOn((prev) => { const next = new Set(prev); if (!next.delete(t)) next.add(t); return next; });

  return (
    <div className="demo-row">
      <div role="toolbar" aria-label="Text formatting" className="a11y-toolbar">
        {TOOLS.map((t, i) => (
          <button key={t} type="button" className="btn btn-small" aria-pressed={on.has(t)}
            onClick={() => toggle(t)} {...getItemProps(i)}>
            {t}
          </button>
        ))}
      </div>
      <output className="a11y-muted">
        One Tab stop · ←/→ Home/End move · Space toggles · tab stop: <span className="mono">{TOOLS[active]}</span>
      </output>
    </div>
  );
}
