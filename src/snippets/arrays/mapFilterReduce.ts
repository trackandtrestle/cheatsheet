export interface Order {
  id: string;
  total: number;
  paid: boolean;
}

// map: transform each item 1:1.
export const ids = (orders: Order[]): string[] => orders.map((o) => o.id);

// filter: keep items matching a predicate.
export const unpaid = (orders: Order[]): Order[] => orders.filter((o) => !o.paid);

// reduce: fold to one value. ALWAYS pass an initial value — it sets the
// accumulator type and makes empty arrays safe.
export const revenue = (orders: Order[]): number =>
  orders.filter((o) => o.paid).reduce((sum, o) => sum + o.total, 0);

// Typed accumulator: annotate the initial value (or use the generic).
export const byId = (orders: Order[]) =>
  orders.reduce<Record<string, Order>>((acc, o) => {
    acc[o.id] = o;
    return acc;
  }, {});

// No initial value: throws on [] and the accumulator is the element type.
export const maxNoInit = (xs: number[]): number => xs.reduce((a, b) => Math.max(a, b));
