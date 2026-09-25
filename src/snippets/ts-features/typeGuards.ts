export interface ApiError {
  code: number;
  message: string;
}

// `value is ApiError`: returning true narrows the argument at the call site.
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'number' &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

export function errorMessage(error: unknown): string {
  if (isApiError(error)) return `${error.code}: ${error.message}`;
  if (error instanceof Error) return error.message; // built-in narrowing
  return String(error);
}

// Guards also narrow arrays through filter().
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export const onlyStrings = (xs: unknown[]): string[] => xs.filter(isString);
