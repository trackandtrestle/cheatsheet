import { describe, expect, it } from 'vitest';
import type { Todo } from './arrayAddRemove';
import { append, prepend, removeAt, removeById } from './arrayAddRemove';

const t = (id: string): Todo => ({ id, text: id, done: false });

describe('array add / remove', () => {
  it('append and prepend return new arrays', () => {
    const list = Object.freeze([t('a')]); // frozen: any mutation would throw
    const added = append(list, t('b'));
    expect(added.map((x) => x.id)).toEqual(['a', 'b']);
    expect(prepend(list, t('z')).map((x) => x.id)).toEqual(['z', 'a']);
    expect(added).not.toBe(list);
    expect(list).toHaveLength(1);
  });

  it('removeById filters without mutating', () => {
    const list = Object.freeze([t('a'), t('b'), t('c')]);
    expect(removeById(list, 'b').map((x) => x.id)).toEqual(['a', 'c']);
    expect(list).toHaveLength(3);
  });

  it('removeAt uses toSpliced', () => {
    const list = Object.freeze(['x', 'y', 'z']);
    expect(removeAt(list, 0)).toEqual(['y', 'z']);
    expect(list).toEqual(['x', 'y', 'z']);
  });
});
