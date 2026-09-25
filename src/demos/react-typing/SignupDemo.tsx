import { useState } from 'react';
import { SignupForm } from '../../snippets/react-typing/FormSubmit';
import type { Signup } from '../../snippets/react-typing/FormSubmit';

export function SignupDemo() {
  const [submitted, setSubmitted] = useState<Signup | null>(null);
  return (
    <div>
      <SignupForm onSignup={setSubmitted} />
      <p className="mono" aria-live="polite">
        {submitted ? `onSignup(${JSON.stringify(submitted)})` : 'Nothing submitted yet'}
      </p>
    </div>
  );
}
