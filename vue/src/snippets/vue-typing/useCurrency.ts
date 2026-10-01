import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';

/**
 * Accepts a plain value, a ref/computed, or a getter (`() => props.amount`):
 * callers pass whatever they have. `toValue()` unwraps it inside the computed,
 * so refs and getters are tracked and plain values just work.
 */
export function useCurrency(
  amount: MaybeRefOrGetter<number>,
  currency: MaybeRefOrGetter<string> = 'USD',
  locale = 'en-US',
): ComputedRef<string> {
  return computed(() =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: toValue(currency) }).format(toValue(amount)),
  );
}

// Prefer a getter over toRef(props, 'amount') when reading a prop:
// const price = useCurrency(() => props.amount, () => props.currency);
