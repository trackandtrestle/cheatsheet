export interface User {
  id: string;
  name: string;
  email?: string;
}

// Partial: every key optional — the natural type for a patch payload.
export type UserPatch = Partial<Omit<User, 'id'>>;

export function updateUser(user: Readonly<User>, patch: UserPatch): User {
  return { ...user, ...patch };
}

// Required: strips every `?` — e.g. once defaults have been applied.
export type ResolvedUser = Required<User>;

export function withDefaults(user: User): ResolvedUser {
  return { ...user, email: user.email ?? `${user.name}@example.com` };
}

// Readonly: forbids reassignment of top-level keys — but it is shallow.
export interface Settings {
  theme: string;
  tags: string[];
}

export function addTag(settings: Readonly<Settings>, tag: string): Settings {
  // settings.theme = 'x';      // error: read-only property
  // settings.tags.push(tag);   // compiles! nested arrays stay mutable
  return { ...settings, tags: [...settings.tags, tag] };
}
