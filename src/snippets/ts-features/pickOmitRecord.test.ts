import { describe, expect, expectTypeOf, it } from 'vitest';
import { countWords, statusLabel, toPublic } from './pickOmitRecord';
import type { Product, ProductCard, PublicProduct, Status } from './pickOmitRecord';

describe('Pick / Omit / Record', () => {
  it('Pick and Omit select keys', () => {
    expectTypeOf<ProductCard>().toEqualTypeOf<{ title: string; price: number }>();
    expectTypeOf<keyof PublicProduct>().toEqualTypeOf<'id' | 'title' | 'price'>();
    const p: Product = { id: 1, title: 'Pen', price: 2, internalNote: 'secret' };
    expect(toPublic(p)).toEqual({ id: 1, title: 'Pen', price: 2 });
  });

  it('Omit does not check that the key exists (typos pass silently)', () => {
    expectTypeOf<Omit<Product, 'internalNotes'>>().toEqualTypeOf<Product>();
    // @ts-expect-error — Pick, by contrast, requires real keys
    type Bad = Pick<Product, 'internalNotes'>;
  });

  it('Record over a union must be exhaustive', () => {
    expect(statusLabel.loading).toBe('Loading…');
    // @ts-expect-error — 'error' is missing
    const partial: Record<Status, string> = { idle: '', loading: '' };
    void partial;
  });

  it('Record<string, V> lookups are possibly undefined', () => {
    const counts = countWords('a b a');
    expect(counts).toEqual({ a: 2, b: 1 });
    expectTypeOf(counts['a']).toEqualTypeOf<number | undefined>();
  });
});
