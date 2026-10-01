import { describe, expect, it } from 'vitest';
import { reactive, ref } from 'vue';
import { useCurrency } from './useCurrency';

describe('MaybeRefOrGetter', () => {
  it('accepts a plain value', () => {
    expect(useCurrency(1234.5).value).toBe('$1,234.50');
  });

  it('tracks a ref', () => {
    const amount = ref(1);
    const price = useCurrency(amount, 'EUR');
    amount.value = 2;
    expect(price.value).toBe('€2.00');
  });

  it('tracks a getter over reactive state (e.g. props)', () => {
    const props = reactive({ amount: 5, currency: 'USD' });
    const price = useCurrency(() => props.amount, () => props.currency);
    expect(price.value).toBe('$5.00');
    props.currency = 'GBP';
    expect(price.value).toBe('£5.00');
  });
});
