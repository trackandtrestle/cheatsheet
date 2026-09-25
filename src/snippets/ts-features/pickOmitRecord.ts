export interface Product {
  id: number;
  title: string;
  price: number;
  internalNote: string;
}

// Pick whitelists keys, Omit blacklists them.
export type ProductCard = Pick<Product, 'title' | 'price'>;
export type PublicProduct = Omit<Product, 'internalNote'>;

export function toPublic({ internalNote: _dropped, ...rest }: Product): PublicProduct {
  return rest;
}

// Record<Union, V> is exhaustive: adding a Status forces a new label.
export type Status = 'idle' | 'loading' | 'error';

export const statusLabel: Record<Status, string> = {
  idle: 'Ready',
  loading: 'Loading…',
  error: 'Something went wrong',
};

// Record<string, V> is a dictionary: with noUncheckedIndexedAccess,
// every lookup is `V | undefined`.
export function countWords(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of text.split(/\s+/).filter(Boolean)) {
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
}
