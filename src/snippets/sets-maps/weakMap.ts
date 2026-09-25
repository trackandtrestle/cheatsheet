// WeakMap: object keys held weakly — entries vanish when the key is collected.
// No size, no iteration: you can only look up keys you already hold.

// 1) Private per-instance data without leaking it on the object.
const secrets = new WeakMap<object, string>();
export class Account {
  constructor(token: string) {
    secrets.set(this, token);
  }
  authHeader(): string {
    return `Bearer ${secrets.get(this) ?? ''}`;
  }
}

// 2) Memoize an expensive derivation per object identity.
export function memoizeByObject<K extends object, R>(fn: (key: K) => R): (key: K) => R {
  const cache = new WeakMap<K, R>();
  return (key) => {
    if (cache.has(key)) return cache.get(key) as R; // R may itself be undefined
    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}
