import { describe, expect, it } from 'vitest';
import type { Node } from './weakSet';
import { collectNames, isValidated, parseEmail } from './weakSet';

describe('WeakSet', () => {
  it('visits each node once, even with cycles', () => {
    const a: Node = { name: 'a', children: [] };
    const b: Node = { name: 'b', children: [a] };
    a.children.push(b); // cycle a -> b -> a
    const root: Node = { name: 'root', children: [a, b] };
    expect(collectNames(root)).toEqual(['root', 'a', 'b']);
  });

  it('brands factory-made objects; look-alikes fail', () => {
    const real = parseEmail('ada@example.com');
    expect(real).not.toBeNull();
    expect(isValidated(real!)).toBe(true);
    expect(isValidated({ address: 'ada@example.com' })).toBe(false);
    expect(parseEmail('nope')).toBeNull();
  });
});
