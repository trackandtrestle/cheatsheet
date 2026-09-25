// as const: literal types + readonly, all the way down.
export const ROLES = ['admin', 'editor', 'viewer'] as const;

// Single source of truth: derive the union from the runtime array.
export type Role = (typeof ROLES)[number]; // 'admin' | 'editor' | 'viewer'

export function isRole(value: string): value is Role {
  // ROLES.includes(value) is an error: string is not assignable to Role.
  return (ROLES as readonly string[]).includes(value);
}

export const HTTP = { ok: 200, notFound: 404 } as const;
export type HttpCode = (typeof HTTP)[keyof typeof HTTP]; // 200 | 404

// Without as const, literals widen.
export const widened = { method: 'GET', roles: ['admin'] }; // { method: string; roles: string[] }

// Accept readonly arrays so callers can pass `as const` data.
export function joinRoles(roles: readonly Role[]): string {
  return roles.join(', ');
}
