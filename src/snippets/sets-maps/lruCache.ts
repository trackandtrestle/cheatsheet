// LRU cache: Map iterates in insertion order, so the first key is the oldest.
export class LruCache<K, V> {
  readonly #map = new Map<K, V>();

  constructor(readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) throw new RangeError('capacity must be >= 1');
  }

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key) as V;
    this.#map.delete(key); // refresh: move to the end
    this.#map.set(key, value);
    return value;
  }

  set(key: K, value: V): this {
    this.#map.delete(key); // re-insert so it becomes most recent
    this.#map.set(key, value);
    if (this.#map.size > this.capacity) {
      const oldest = this.#map.keys().next();
      if (!oldest.done) this.#map.delete(oldest.value);
    }
    return this;
  }

  has(key: K): boolean {
    return this.#map.has(key); // does NOT refresh recency
  }

  get size(): number {
    return this.#map.size;
  }

  keys(): K[] {
    return [...this.#map.keys()]; // oldest -> newest
  }
}
