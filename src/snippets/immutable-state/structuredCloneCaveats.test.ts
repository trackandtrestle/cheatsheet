import { describe, expect, it } from 'vitest';
import { cloneMoney, cloneThenEdit, cloneWithFunction, clonesRichTypes, Money } from './structuredCloneCaveats';

describe('structuredClone caveats', () => {
  it('deep-copies Dates, Sets and Maps', () => {
    const { original, copy } = clonesRichTypes();
    expect(copy.when).toBeInstanceOf(Date);
    expect(copy.when.getTime()).toBe(0);
    expect(copy.tags).toEqual(new Set(['a']));
    expect(copy.scores.get('ada')).toBe(1);
    expect(copy.nested).not.toBe(original.nested);
  });

  it('throws DataCloneError for functions', () => {
    expect(cloneWithFunction).toThrow(expect.objectContaining({ name: 'DataCloneError' }));
  });

  it('drops class prototypes', () => {
    const copy = cloneMoney(new Money(250));
    expect(copy).not.toBeInstanceOf(Money);
    expect(copy.cents).toBe(250);
    expect((copy as Partial<Money>).format).toBeUndefined();
  });

  it('loses structural sharing', () => {
    const state = { count: 0, big: { rows: [1, 2, 3] } };
    const next = cloneThenEdit(state);
    expect(next.count).toBe(1);
    expect(next.big).not.toBe(state.big); // untouched branch got a new reference
  });
});
