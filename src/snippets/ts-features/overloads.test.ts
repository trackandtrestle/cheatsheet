import { describe, expect, expectTypeOf, it } from 'vitest';
import { getElement, parse, parseAny } from './overloads';

describe('function overloads', () => {
  it('picks the return type per overload', () => {
    expectTypeOf(parse('1')).toEqualTypeOf<number>();
    expectTypeOf(parse(['1', '2'])).toEqualTypeOf<number[]>();
    expect(parse('1')).toBe(1);
    expect(parse(['1', '2'])).toEqual([1, 2]);

    document.body.innerHTML = '<input value="x" />';
    const input = getElement(document, 'input');
    expectTypeOf(input).toEqualTypeOf<HTMLInputElement | null>();
    expect(input?.value).toBe('x');
    expectTypeOf(getElement(document, 'div')).toEqualTypeOf<Element | null>();
  });

  it('a union argument matches no single overload', () => {
    const value = Math.random() > 2 ? 'x' : ['y'];
    // @ts-expect-error — the implementation signature is not callable
    parse(value);
    expectTypeOf(parseAny(value)).toEqualTypeOf<number | number[]>();
    expect(parseAny(['3'])).toEqual([3]);
  });
});
