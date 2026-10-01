import { describe, expect, it } from 'vitest';
import { isReactive } from 'vue';
import { destructuringPitfall, useCart } from './toRefs';

describe('toRefs / toRef', () => {
  it('keeps destructured refs linked to the reactive source', () => {
    const { items, coupon, add } = useCart();
    add();
    expect(items.value).toBe(1);
    coupon.value = 'SAVE10';
    expect(coupon.value).toBe('SAVE10');
  });

  it('plain destructuring and spreading take a snapshot', () => {
    const { snapshot, spread, linked, readOnly } = destructuringPitfall();
    expect(snapshot).toBe(0);
    expect(spread.items).toBe(0);
    expect(isReactive(spread)).toBe(false);
    expect(linked.value).toBe(5);
    expect(readOnly.value).toBe(5);
    linked.value = 7;
    expect(readOnly.value).toBe(7);
  });
});
