import { useState, type FormEvent } from 'react';

type OnSubmit = (name: string) => void;

// Controlled: React state is the source of truth -> instant validation/formatting.
export function ControlledName({ onSubmit }: { onSubmit: OnSubmit }) {
  const [name, setName] = useState('');
  const tooLong = name.length > 10;
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(name); }}>
      <label>Name <input value={name} onChange={(e) => setName(e.target.value)} aria-invalid={tooLong} /></label>
      {tooLong && <p role="alert">Max 10 characters</p>}
      <button disabled={tooLong}>Save</button>
    </form>
  );
}

// Uncontrolled: the DOM holds the value; read it on submit. Less re-rendering.
export function UncontrolledName({ onSubmit }: { onSubmit: OnSubmit }) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit(String(data.get('name') ?? ''));
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Name <input name="name" defaultValue="Ada" /></label>
      <button>Save</button>
    </form>
  );
}
