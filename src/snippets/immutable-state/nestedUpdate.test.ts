import { describe, expect, it } from 'vitest';
import type { Settings } from './nestedUpdate';
import { addTag, patchSection, setCity, setCityWrong } from './nestedUpdate';

const make = (): Settings => ({
  user: { name: 'Ada', address: { city: 'London', zip: 'N1' } },
  prefs: { theme: 'light', tags: ['a'] },
});

describe('nested updates', () => {
  it('copies the path and shares untouched branches', () => {
    const s = make();
    const next = setCity(s, 'Paris');
    expect(next.user.address.city).toBe('Paris');
    expect(s.user.address.city).toBe('London');
    expect(next.prefs).toBe(s.prefs); // structural sharing
    expect(next.user).not.toBe(s.user);
  });

  it('appends to a nested array immutably', () => {
    const s = make();
    expect(addTag(s, 'b').prefs.tags).toEqual(['a', 'b']);
    expect(s.prefs.tags).toEqual(['a']);
  });

  it('patchSection merges one level', () => {
    const s = make();
    const next = patchSection(s, 'prefs', { theme: 'dark' });
    expect(next.prefs).toEqual({ theme: 'dark', tags: ['a'] });
    expect(next.user).toBe(s.user);
  });

  it('shallow copy + nested assignment mutates the original', () => {
    const s = make();
    setCityWrong(s, 'Rome');
    expect(s.user.address.city).toBe('Rome');
  });
});
