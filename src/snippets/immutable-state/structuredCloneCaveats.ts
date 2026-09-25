// structuredClone deep-copies plain data, including types JSON can't.
export function clonesRichTypes() {
  const original = {
    when: new Date(0),
    tags: new Set(['a']),
    scores: new Map([['ada', 1]]),
    nested: { list: [1, 2] },
  };
  const copy = structuredClone(original);
  return { original, copy };
}

// Functions, symbols and DOM nodes throw.
export function cloneWithFunction(): unknown {
  return structuredClone({ onClick: () => {} }); // DataCloneError
}

// Class instances come back as plain objects: prototype and methods are lost.
export class Money {
  constructor(readonly cents: number) {}
  format(): string {
    return `$${(this.cents / 100).toFixed(2)}`;
  }
}
export const cloneMoney = (m: Money): Money => structuredClone(m); // type lies!

// Not a substitute for immutable updates: cloning everything breaks reference
// equality for untouched branches, so every memo/React.memo child rerenders.
export function cloneThenEdit<T extends { count: number }>(state: T): T {
  const next = structuredClone(state); // O(size of state) on every update
  next.count += 1;
  return next;
}
