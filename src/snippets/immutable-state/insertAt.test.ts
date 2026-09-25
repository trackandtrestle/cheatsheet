import { describe, expect, it } from 'vitest';
import { insertAfter, insertAt, insertAtSlice } from './insertAt';

describe('insertAt', () => {
  const list = Object.freeze(['a', 'b', 'c']);

  it('inserts without mutating (toSpliced and slice agree)', () => {
    expect(insertAt(list, 1, 'X')).toEqual(['a', 'X', 'b', 'c']);
    expect(insertAtSlice(list, 1, 'X')).toEqual(['a', 'X', 'b', 'c']);
    expect(list).toEqual(['a', 'b', 'c']);
  });

  it('handles edges and multiple items', () => {
    expect(insertAt(list, 0, 'X', 'Y')).toEqual(['X', 'Y', 'a', 'b', 'c']);
    expect(insertAt(list, 99, 'Z')).toEqual(['a', 'b', 'c', 'Z']);
    expect(insertAt(list, -1, 'Z')).toEqual(['a', 'b', 'Z', 'c']); // negative counts from end
  });

  it('insertAfter targets an id, or appends', () => {
    const rows = [{ id: '1' }, { id: '2' }];
    expect(insertAfter(rows, '1', { id: 'new' }).map((r) => r.id)).toEqual(['1', 'new', '2']);
    expect(insertAfter(rows, 'missing', { id: 'new' }).map((r) => r.id)).toEqual(['1', '2', 'new']);
  });
});
