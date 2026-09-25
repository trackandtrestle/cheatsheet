import { useId, type InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint: string;
}

export function Field({ label, hint, ...inputProps }: FieldProps) {
  // Unique per instance and identical on server + client (hydration-safe).
  // Never use Math.random() or a module counter for ids.
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={hintId} {...inputProps} />
      <p id={hintId}>{hint}</p>
    </div>
  );
}
