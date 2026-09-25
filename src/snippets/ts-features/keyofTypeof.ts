export const defaults = { theme: 'dark', fontSize: 14, showGrid: true };

// typeof lifts a value into the type world; keyof lists its keys.
export type Settings = typeof defaults; // { theme: string; fontSize: number; showGrid: boolean }
export type SettingKey = keyof Settings; // 'theme' | 'fontSize' | 'showGrid'

// K ties the key to its value type: getSetting(s, 'fontSize') is number.
export function getSetting<K extends SettingKey>(settings: Settings, key: K): Settings[K] {
  return settings[key];
}

export function setSetting<K extends SettingKey>(
  settings: Settings,
  key: K,
  value: Settings[K],
): Settings {
  return { ...settings, [key]: value };
}

// Object.keys returns string[] (an object may carry extra keys at runtime),
// so narrowing to keyof is a deliberate, local cast.
export function settingKeys(settings: Settings): SettingKey[] {
  return Object.keys(settings) as SettingKey[];
}
