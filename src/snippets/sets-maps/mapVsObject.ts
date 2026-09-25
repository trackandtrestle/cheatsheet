// Map: any key type, real size, no prototype keys, tuned for add/delete churn.
export function mapKeys() {
  const el = { tag: 'div' };
  const m = new Map<unknown, string>([[el, 'object'], [1, 'number'], ['1', 'string']]);
  return { size: m.size, byObject: m.get(el), numberVsString: m.get(1) !== m.get('1') };
}

// Plain objects stringify keys: 1 and '1' collide, objects become "[object Object]".
export function objectKeys() {
  const o: Record<string, string> = {};
  o[String(1)] = 'number';
  o['1'] = 'string'; // overwrites
  return Object.keys(o).length; // 1
}

// Prototype keys: "__proto__" on a {} literal is a setter, not a key.
export function protoKey() {
  const o: Record<string, unknown> = {};
  o['__proto__'] = { polluted: true }; // sets the prototype!
  const m = new Map<string, unknown>([['__proto__', { polluted: true }]]);
  return { objectHasOwn: Object.hasOwn(o, '__proto__'), mapHas: m.has('__proto__') };
}

// If you must use an object as a dictionary, drop the prototype.
export const dict = <V>(): Record<string, V> => Object.create(null) as Record<string, V>;
