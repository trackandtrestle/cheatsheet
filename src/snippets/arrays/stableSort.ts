export interface Task {
  name: string;
  priority: number;
}

// Since ES2019, Array.prototype.sort is STABLE: equal items keep their
// original relative order. So sorting by a secondary key first, then by
// the primary key, gives a correct multi-key sort.
export function byPriorityThenName(tasks: Task[]): Task[] {
  return tasks
    .toSorted((a, b) => a.name.localeCompare(b.name)) // secondary
    .toSorted((a, b) => a.priority - b.priority); // primary (stable)
}

// Stability relies on a CONSISTENT comparator. Random comparators are not a shuffle.
export function shuffle<T>(xs: readonly T[], rand: () => number = Math.random): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T]; // Fisher–Yates
  }
  return out;
}
