import { useLayoutEffect, useRef, useState } from 'react';

export interface Size { width: number; height: number }

// Measure an element and re-render when IT resizes (not just the window).
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      // contentBoxSize is the modern API; it's an array (multi-column fragments).
      const box = entry.contentBoxSize[0];
      const next = box ? { width: box.inlineSize, height: box.blockSize } : entry.contentRect;
      // Bail out of identical sizes to avoid render loops.
      setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : { width: next.width, height: next.height }));
    });
    observer.observe(el); // also fires once immediately with the initial size
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
