import { useActionState } from 'react';

export type SubscribeState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; email: string };

export function SubscribeForm({ subscribe }: { subscribe: (email: string) => Promise<void> }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: SubscribeState, data: FormData): Promise<SubscribeState> => {
      const email = String(data.get('email') ?? '').trim();
      if (!email.includes('@')) return { status: 'error', message: 'Enter a valid email.' };
      try {
        await subscribe(email);
        return { status: 'success', email };
      } catch (err) {
        return { status: 'error', message: err instanceof Error ? err.message : 'Failed.' };
      }
    },
    { status: 'idle' },
  );

  return (
    // No onSubmit/preventDefault: React runs the action in a transition.
    <form action={formAction} className="demo-row">
      <label>
        Email <input name="email" autoComplete="email" />
      </label>
      <button className="btn btn-primary" disabled={isPending}>
        {isPending ? 'Subscribing…' : 'Subscribe'}
      </button>
      {state.status === 'error' && <p role="alert">{state.message}</p>}
      {state.status === 'success' && <p role="status">Subscribed {state.email}</p>}
    </form>
  );
}
