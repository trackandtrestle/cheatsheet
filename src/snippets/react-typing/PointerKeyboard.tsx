import { useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

export function Toolbar({ onSave }: { onSave: () => void }) {
  const [last, setLast] = useState('none');

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault(); // stop the browser's "save page"
      onSave();
    }
  }

  // One delegated handler for all buttons.
  // currentTarget: the element the handler is on — typed HTMLDivElement.
  // target: what was actually clicked — only EventTarget, so narrow it.
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const button = e.target instanceof Element ? e.target.closest('button') : null;
    if (!button) return;
    setLast(`${button.name}${e.shiftKey ? ' (shift)' : ''} in ${e.currentTarget.id}`);
  }

  return (
    <div id="toolbar" role="toolbar" aria-label="Editor" onKeyDown={handleKeyDown} onClick={handleClick}>
      <button name="bold">B</button>
      <button name="italic">I</button>
      <output>{last}</output>
    </div>
  );
}
