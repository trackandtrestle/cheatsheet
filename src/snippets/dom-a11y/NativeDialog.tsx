import { useEffect, useId, useRef, type ReactNode } from 'react';

interface Props { open: boolean; onClose: () => void; title: string; children: ReactNode }

// showModal() gives you for free: focus moved inside, Tab trapped (rest of page is
// inert), Escape closes, focus restored to the opener, ::backdrop, top layer (no z-index).
export function NativeDialog({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal(); // NOT `open` attribute: that's non-modal
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // `close` fires for Escape, form[method=dialog] and .close(): sync React state here.
    <dialog ref={ref} aria-labelledby={titleId} onClose={onClose}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button type="button" autoFocus onClick={() => ref.current?.close()}>Close</button>
    </dialog>
  );
}
