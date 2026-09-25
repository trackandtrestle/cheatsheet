// Map of arrays: one key -> many values.
export class MultiMap<K, V> {
  readonly #map = new Map<K, V[]>();

  add(key: K, value: V): this {
    const bucket = this.#map.get(key);
    if (bucket) bucket.push(value);
    else this.#map.set(key, [value]);
    return this;
  }

  /** Always returns an array; empty (and readonly) for missing keys. */
  get(key: K): readonly V[] {
    return this.#map.get(key) ?? [];
  }

  delete(key: K, value: V): boolean {
    const bucket = this.#map.get(key);
    const i = bucket?.indexOf(value) ?? -1;
    if (!bucket || i === -1) return false;
    bucket.splice(i, 1);
    if (bucket.length === 0) this.#map.delete(key); // no empty buckets
    return true;
  }

  get keyCount(): number {
    return this.#map.size;
  }

  *entries(): IterableIterator<[K, readonly V[]]> {
    yield* this.#map;
  }
}
