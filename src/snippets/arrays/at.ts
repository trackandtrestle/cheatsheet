// at() accepts negative indexes: -1 is the last item.
export const last = <T,>(xs: readonly T[]): T | undefined => xs.at(-1);

// Old way: easy to get wrong, and xs[-1] is silently undefined.
export const lastOld = <T,>(xs: readonly T[]): T | undefined => xs[xs.length - 1];

// at() is typed T | undefined ALWAYS; with noUncheckedIndexedAccess so is xs[i].
// Handle the miss with ?? or an explicit guard instead of `!`.
export function initials(names: string[]): string {
  const first = names.at(0)?.[0] ?? '?';
  const lastInitial = names.at(-1)?.[0] ?? '?';
  return `${first}${lastInitial}`;
}

// Works on strings too.
export const lastChar = (s: string): string | undefined => s.at(-1);
