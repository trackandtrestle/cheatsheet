import type { CSSProperties, ReactNode } from 'react';

// Hidden visually but still in the accessibility tree (unlike display:none / hidden).
export const visuallyHidden: CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0,
};

// First focusable element on the page; appears only when focused (CSS below).
// .skip-link { position: absolute; transform: translateY(-120%) }
// .skip-link:focus { transform: none }
export function Layout({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      {nav}
      {/* tabIndex=-1 lets the target receive focus, so the NEXT Tab continues from here */}
      <main id="main" tabIndex={-1}>{children}</main>
    </>
  );
}

export function IconButton({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}>
      <span aria-hidden="true">{icon}</span>
      <span style={visuallyHidden}>{label}</span>
    </button>
  );
}
