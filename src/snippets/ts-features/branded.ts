// A phantom property that exists only in the type system.
declare const brand: unique symbol;
export type Brand<T, B extends string> = T & { readonly [brand]: B };

export type UserId = Brand<string, 'UserId'>;
export type OrderId = Brand<string, 'OrderId'>;
export type Cents = Brand<number, 'Cents'>;

// The only way in is a validating constructor ("smart constructor").
export function toUserId(raw: string): UserId {
  if (!/^u_[a-z0-9]+$/.test(raw)) throw new Error(`Invalid user id: ${raw}`);
  return raw as UserId;
}

export function toOrderId(raw: string): OrderId {
  return raw as OrderId;
}

export function toCents(dollars: number): Cents {
  return Math.round(dollars * 100) as Cents;
}

export function ordersUrl(userId: UserId): string {
  return `/users/${userId}/orders`; // still a string at runtime
}
