import { describe, expect, it } from 'vitest';
import { localeSorted, looseEquals, naive, naturalSort } from './collator';

describe('localeCompare / Intl.Collator', () => {
  it('naive sort uses code units', () => {
    expect(naive(['b', 'Z', 'a'])).toEqual(['Z', 'a', 'b']);
  });
  it('localeCompare is case-aware', () => {
    expect(localeSorted(['b', 'Z', 'a'])).toEqual(['a', 'b', 'Z']);
  });
  it('numeric collation sorts naturally', () => {
    expect(naturalSort(['file10', 'file2', 'file1'])).toEqual(['file1', 'file2', 'file10']);
  });
  it('base sensitivity ignores case and accents', () => {
    expect(looseEquals('resume', 'Résumé')).toBe(true);
    expect(looseEquals('a', 'b')).toBe(false);
  });
});
