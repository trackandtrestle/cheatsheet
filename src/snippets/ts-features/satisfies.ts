export interface Route {
  path: string;
  auth?: boolean;
}

// Annotation: the variable HAS the annotated type — specifics are lost.
export const annotated: Record<string, Route> = {
  home: { path: '/' },
  admin: { path: '/admin', auth: true },
};
// annotated.admin -> Route | undefined, keyof -> string

// satisfies: checked against the type, but keeps the inferred type.
export const routes = {
  home: { path: '/' },
  admin: { path: '/admin', auth: true },
} satisfies Record<string, Route>;
// routes.admin -> { path: string; auth: true }

export type RouteName = keyof typeof routes; // 'home' | 'admin'

// `as const satisfies` = validated AND literal/readonly.
export const palette = {
  primary: '#3b82f6',
  danger: [220, 38, 38],
} as const satisfies Record<string, string | readonly [number, number, number]>;

export function href(name: RouteName): string {
  return routes[name].path; // no undefined check needed
}
