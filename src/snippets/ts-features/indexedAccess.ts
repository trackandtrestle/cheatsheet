export interface ApiResponse {
  user: { id: string; profile: { avatarUrl: string | null } };
  items: { sku: string; qty: number }[];
}

// T['key'] digs into nested types without redeclaring them.
export type Profile = ApiResponse['user']['profile'];

// T[number] gives the element type of an array or tuple.
export type Item = ApiResponse['items'][number];

// A union of keys gives a union of property types.
export type UserOrItems = ApiResponse['user' | 'items'];

// T[keyof T]: all value types of an object.
export type ValueOf<T> = T[keyof T];

export const SIZES = ['sm', 'md', 'lg'] as const;
export type Size = (typeof SIZES)[number]; // 'sm' | 'md' | 'lg'

export function totalQty(items: ApiResponse['items']): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function avatar(profile: Profile): string {
  return profile.avatarUrl ?? '/default-avatar.png';
}
