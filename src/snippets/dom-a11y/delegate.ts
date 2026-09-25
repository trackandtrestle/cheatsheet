// One listener on a stable ancestor handles clicks on current AND future children.
export function delegate<K extends keyof HTMLElementEventMap>(
  root: HTMLElement,
  type: K,
  selector: string,
  handler: (event: HTMLElementEventMap[K], match: HTMLElement) => void,
): () => void {
  const listener = (event: HTMLElementEventMap[K]) => {
    // event.target may be a nested <svg>/<span>: walk up to the matching element…
    const target = event.target instanceof Element ? event.target : null;
    const match = target?.closest<HTMLElement>(selector);
    // …but don't match an ancestor OUTSIDE root (closest can climb past it).
    if (match && root.contains(match)) handler(event, match);
  };
  root.addEventListener(type, listener);
  return () => root.removeEventListener(type, listener);
}

// Usage: data-* attributes carry the payload, so rows need no per-item closures.
export function wireTodoList(list: HTMLUListElement, onAction: (action: string, id: string) => void) {
  return delegate(list, 'click', '[data-action]', (_e, button) => {
    const id = button.closest<HTMLElement>('[data-id]')?.dataset.id;
    const action = button.dataset.action;
    if (id && action) onAction(action, id);
  });
}
