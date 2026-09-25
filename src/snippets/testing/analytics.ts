// Module under test's dependency — replaced in mockModule.test.tsx.
export function track(event: string, props?: Record<string, unknown>): void {
  void fetch('/analytics', { method: 'POST', body: JSON.stringify({ event, props }) });
}
export const FLAGS = { newCheckout: false };
