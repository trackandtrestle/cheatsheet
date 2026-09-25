import { describe, expect, expectTypeOf, it } from 'vitest';
import { defaults, getSetting, setSetting, settingKeys } from './keyofTypeof';
import type { SettingKey, Settings } from './keyofTypeof';

describe('keyof / typeof', () => {
  it('derives types from a value', () => {
    expectTypeOf<Settings>().toEqualTypeOf<{ theme: string; fontSize: number; showGrid: boolean }>();
    expectTypeOf<SettingKey>().toEqualTypeOf<'theme' | 'fontSize' | 'showGrid'>();
    expectTypeOf(Object.keys(defaults)).toEqualTypeOf<string[]>();
    expect(settingKeys(defaults)).toEqual(['theme', 'fontSize', 'showGrid']);
  });

  it('links a key to its value type', () => {
    const size = getSetting(defaults, 'fontSize');
    expectTypeOf(size).toEqualTypeOf<number>();
    expect(size).toBe(14);
    expect(setSetting(defaults, 'theme', 'light').theme).toBe('light');
    // @ts-expect-error — fontSize expects a number
    setSetting(defaults, 'fontSize', '16px');
    // @ts-expect-error — unknown key
    getSetting(defaults, 'color');
  });
});
