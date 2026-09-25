import { useState } from 'react';
import type { ChangeEvent, ChangeEventHandler } from 'react';

export function ProfileForm() {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('free');
  const [agreed, setAgreed] = useState(false);

  // Option 1: annotate the event parameter.
  function handleName(e: ChangeEvent<HTMLInputElement>) {
    setName(e.currentTarget.value);
  }

  // Option 2: annotate the whole handler with the *EventHandler alias.
  const handlePlan: ChangeEventHandler<HTMLSelectElement> = (e) => setPlan(e.currentTarget.value);

  return (
    <form>
      <label>
        Name <input value={name} onChange={handleName} />
      </label>
      <label>
        Plan
        <select value={plan} onChange={handlePlan}>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </label>
      <label>
        {/* Option 3: inline — `e` is inferred from the element. */}
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.currentTarget.checked)} />
        Agree
      </label>
      <output>{`${name}|${plan}|${agreed}`}</output>
    </form>
  );
}
