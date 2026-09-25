// First FULFILLED wins; rejections are ignored unless every promise rejects,
// in which case it rejects with an AggregateError holding all the reasons.
export function fastestMirror<T>(mirrors: readonly (() => Promise<T>)[]): Promise<T> {
  return Promise.any(mirrors.map((load) => load()));
}

export function reasonsOf(error: unknown): unknown[] {
  return error instanceof AggregateError ? error.errors : [error];
}
