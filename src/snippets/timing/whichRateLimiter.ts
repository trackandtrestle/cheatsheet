// Which rate limiter? Pick by what the user is doing, not by habit.
export const RATE_LIMITERS = {
  'act when the user stops': {
    use: 'debounce (trailing)',
    examples: ['search-as-you-type', 'autosave', 'resize end'],
  },
  'act on the first call, swallow repeats': {
    use: 'debounce (leading)',
    examples: ['double-submit guard', 'double-click'],
  },
  'instant feedback and the final value': {
    use: 'debounce (leading + trailing)',
    examples: ['validation hint', 'optimistic filter'],
  },
  'act at a steady rate while it keeps happening': {
    use: 'throttle',
    examples: ['scroll spy', 'drag', 'progress reporting'],
  },
  'at most once per frame for layout work': {
    use: 'requestAnimationFrame throttle',
    examples: ['pointermove', 'parallax', 'sticky header'],
  },
} as const satisfies Record<string, { use: string; examples: readonly string[] }>;

export type Goal = keyof typeof RATE_LIMITERS;

export const pickRateLimiter = (goal: Goal) => RATE_LIMITERS[goal].use;
