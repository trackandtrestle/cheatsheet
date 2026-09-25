import { describe, expect, expectTypeOf, it } from 'vitest';
import { assertIsDefined, assertString, getRoot, parsePort } from './assertionFunctions';

describe('assertion functions (asserts x is T)', () => {
  it('throws when the assertion fails', () => {
    document.body.innerHTML = '';
    expect(() => getRoot(document)).toThrow('Expected #root to be defined');
    document.body.innerHTML = '<div id="root"></div>';
    expect(getRoot(document).id).toBe('root');
    expect(parsePort('8080')).toBe(8080);
    expect(() => parsePort('http')).toThrow('Invalid port: http');
    expect(() => assertString(1)).toThrow(TypeError);
  });

  it('narrows after the call', () => {
    const maybe = document.querySelector('div');
    expectTypeOf(maybe).toEqualTypeOf<HTMLDivElement | null>();
    assertIsDefined(maybe);
    expectTypeOf(maybe).toEqualTypeOf<HTMLDivElement>();

    const v: unknown = 'x';
    assertString(v);
    expectTypeOf(v).toEqualTypeOf<string>();
  });
});
