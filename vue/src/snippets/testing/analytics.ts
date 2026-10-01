// Dependency of the component in mockModule.test.ts — replaced there with vi.mock.
export function track(event: string, props?: Record<string, unknown>): void {
  void fetch('/analytics', { method: 'POST', body: JSON.stringify({ event, props }) });
}
export const FLAGS = { newCheckout: false };
