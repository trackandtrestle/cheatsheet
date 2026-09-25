import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ForwardedRef, ReactElement, Ref } from 'react';

// Legacy (React ≤ 18) API. Generic order is <RefType, Props>,
// the reverse of the render callback's (props, ref).
export const FancyInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  function FancyInput(props, ref) {
    return <input className="fancy" {...props} ref={ref} />;
  },
);

// forwardRef erases generics: T becomes unknown. Re-assert the signature.
interface RowProps<T> {
  item: T;
  format: (item: T) => string;
}

function RowInner<T>({ item, format }: RowProps<T>, ref: ForwardedRef<HTMLLIElement>) {
  return <li ref={ref}>{format(item)}</li>;
}

export const Row = forwardRef(RowInner) as <T>(
  props: RowProps<T> & { ref?: Ref<HTMLLIElement> },
) => ReactElement;
