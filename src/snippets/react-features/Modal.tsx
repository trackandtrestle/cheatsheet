import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  container?: Element; // defaults to document.body (client only)
}

export function Modal({ open, title, onClose, children, container }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  // Rendered into another DOM node (escapes overflow/z-index), but it stays in
  // the React tree: context flows and React events bubble to React ancestors.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>,
    container ?? document.body,
  );
}
