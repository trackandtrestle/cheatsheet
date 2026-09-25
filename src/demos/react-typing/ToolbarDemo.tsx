import { useState } from 'react';
import { Toolbar } from '../../snippets/react-typing/PointerKeyboard';

export function ToolbarDemo() {
  const [saves, setSaves] = useState(0);
  return (
    <div>
      <p>Click a button (try holding Shift), or focus one and press Ctrl/⌘ + S.</p>
      <Toolbar onSave={() => setSaves((n) => n + 1)} />
      <p className="mono" aria-live="polite">saves: {saves}</p>
    </div>
  );
}
