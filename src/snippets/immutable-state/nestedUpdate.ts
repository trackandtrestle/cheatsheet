export interface Settings {
  user: { name: string; address: { city: string; zip: string } };
  prefs: { theme: 'light' | 'dark'; tags: readonly string[] };
}

// Copy every level on the path to the change; share everything else.
export function setCity(s: Settings, city: string): Settings {
  return {
    ...s,
    user: { ...s.user, address: { ...s.user.address, city } },
  };
}

export function addTag(s: Settings, tag: string): Settings {
  return { ...s, prefs: { ...s.prefs, tags: [...s.prefs.tags, tag] } };
}

// Typed one-level helper: key and value are checked against the slice's type.
export function patchSection<K extends keyof Settings>(
  s: Settings,
  key: K,
  patch: Partial<Settings[K]>,
): Settings {
  return { ...s, [key]: { ...s[key], ...patch } };
}

// BUG: a shallow copy shares nested objects — this mutates the original too.
export function setCityWrong(s: Settings, city: string): Settings {
  const next = { ...s };
  next.user.address.city = city;
  return next;
}
