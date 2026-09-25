// Overload signatures (what callers see) + one implementation (hidden).
export function parse(input: string): number;
export function parse(input: readonly string[]): number[];
export function parse(input: string | readonly string[]): number | number[] {
  return typeof input === 'string' ? Number(input) : input.map(Number);
}

// The return type depends on a literal argument.
export function getElement(doc: Document, tag: 'input'): HTMLInputElement | null;
export function getElement(doc: Document, tag: 'button'): HTMLButtonElement | null;
export function getElement(doc: Document, tag: string): Element | null;
export function getElement(doc: Document, tag: string): Element | null {
  return doc.querySelector(tag);
}

// Often a generic + conditional type is simpler than many overloads.
export function parseAny<T extends string | readonly string[]>(
  input: T,
): T extends string ? number : number[] {
  return (typeof input === 'string' ? Number(input) : input.map(Number)) as T extends string
    ? number
    : number[];
}
