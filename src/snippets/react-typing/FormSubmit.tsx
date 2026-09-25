import { useState } from 'react';
import type { SubmitEvent } from 'react';

export interface Signup {
  email: string;
  plan: 'free' | 'pro';
}

export function SignupForm({ onSignup }: { onSignup: (data: Signup) => void }) {
  const [error, setError] = useState<string | null>(null);

  // React 19 types: SubmitEvent (FormEvent is deprecated).
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email'); // FormDataEntryValue | null = string | File | null
    const plan = form.get('plan');
    if (typeof email !== 'string' || !email.includes('@')) {
      setError('Enter a valid email');
    } else if (plan !== 'free' && plan !== 'pro') {
      setError('Pick a plan');
    } else {
      setError(null);
      onSignup({ email, plan }); // narrowed to Signup
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>Email <input name="email" type="email" /></label>
      <label><input type="radio" name="plan" value="free" /> Free</label>
      <label><input type="radio" name="plan" value="pro" /> Pro</label>
      <button type="submit">Sign up</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
