// Mapped type: iterate keys with `in keyof`, transform each property.
export type Nullable<T> = { [K in keyof T]: T[K] | null };

// Modifiers: `-readonly` / `-?` remove, `readonly` / `?` add.
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
export type Concrete<T> = { [K in keyof T]-?: T[K] };

// `as` remaps keys: derive getter names from property names.
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

// Remapping to `never` drops the key: filter properties by value type.
export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export function makeGetters<T extends object>(obj: T): Getters<T> {
  const entries = Object.entries(obj).map(([key, value]) => [
    `get${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    () => value,
  ]);
  return Object.fromEntries(entries) as Getters<T>;
}
