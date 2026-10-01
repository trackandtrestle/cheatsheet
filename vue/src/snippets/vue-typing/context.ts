import { inject, provide, type InjectionKey } from 'vue';

/**
 * Typed provide/inject pair. The consumer returns `T` (not `T | undefined`)
 * and fails loudly when no provider is mounted above it.
 */
export function createContext<T>(name: string) {
  const key: InjectionKey<T> = Symbol(name);

  function provideContext(value: T): T {
    provide(key, value);
    return value;
  }

  function useContext(): T {
    // Passing a default (null) silences Vue's "injection not found" warning.
    const value = inject<T | null>(key, null);
    if (value === null) throw new Error(`use${name}() must be used inside a ${name} provider`);
    return value;
  }

  return [provideContext, useContext] as const;
}

// Usage: export const [provideCart, useCart] = createContext<Cart>('Cart');
