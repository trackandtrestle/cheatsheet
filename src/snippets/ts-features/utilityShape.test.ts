import { describe, expect, expectTypeOf, it } from 'vitest';
import { addTag, updateUser, withDefaults } from './utilityShape';
import type { ResolvedUser, Settings, UserPatch } from './utilityShape';

describe('Partial / Required / Readonly', () => {
  it('Partial makes every key optional', () => {
    expectTypeOf<UserPatch>().toEqualTypeOf<{ name?: string; email?: string }>();
    expect(updateUser({ id: '1', name: 'Ada' }, { email: 'a@b.c' })).toEqual({
      id: '1',
      name: 'Ada',
      email: 'a@b.c',
    });
    // @ts-expect-error — id was omitted from the patch type
    updateUser({ id: '1', name: 'Ada' }, { id: '2' });
  });

  it('Required removes optionality', () => {
    expectTypeOf<ResolvedUser>().toEqualTypeOf<{ id: string; name: string; email: string }>();
    expect(withDefaults({ id: '1', name: 'ada' }).email).toBe('ada@example.com');
  });

  it('Readonly is shallow', () => {
    const s: Readonly<Settings> = { theme: 'dark', tags: ['a'] };
    // @ts-expect-error — top-level keys are read-only
    s.theme = 'light';
    s.tags.push('mutated'); // allowed: nested values are not readonly
    expect(addTag(s, 'b').tags).toEqual(['a', 'mutated', 'b']);
  });
});
