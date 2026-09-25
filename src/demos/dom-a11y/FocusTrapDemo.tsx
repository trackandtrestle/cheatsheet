import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../snippets/dom-a11y/useFocusTrap';
import './dom-a11y.css';

function Modal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [extra, setExtra] = useState(0);
  const titleId = useId();
  useFocusTrap(ref, onClose);
  return createPortal(
    <div className="a11y-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className="a11y-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <h2 id={titleId}>Rename file</h2>
        <label className="a11y-field">
          Name <input type="text" defaultValue="report.pdf" />
        </label>
        {Array.from({ length: extra }, (_, i) => (
          <label key={i} className="a11y-field">Tag {i + 1} <input type="text" /></label>
        ))}
        <p className="a11y-muted">Tab / Shift+Tab wrap · Esc closes · focus returns to the opener.</p>
        <div className="demo-row">
          <button type="button" className="btn btn-small" onClick={() => setExtra((n) => n + 1)}>Add tag field</button>
          <button type="button" className="btn btn-small" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-small btn-primary" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function FocusTrapDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-row">
      <button type="button" className="btn" onClick={() => setOpen(true)}>Open modal</button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </div>
  );
}
