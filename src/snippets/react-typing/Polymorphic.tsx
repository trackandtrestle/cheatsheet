import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

// `as` picks the element; that element's props are merged in.
export type BoxProps<E extends ElementType> = {
  as?: E;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children'>;

export function Box<E extends ElementType = 'div'>({ as, children, ...rest }: BoxProps<E>) {
  const Component: ElementType = as ?? 'div';
  return <Component {...rest}>{children}</Component>;
}
