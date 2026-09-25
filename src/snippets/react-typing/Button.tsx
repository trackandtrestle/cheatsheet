import type { ComponentProps, ComponentPropsWithoutRef } from 'react';

// Inherit every native <button> prop: onClick, disabled, aria-*, type...
// In React 19 ComponentProps<'button'> also includes `ref`.
export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'ghost';
}

export function Button({ variant = 'primary', type = 'button', className, ...rest }: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...rest} />;
}

// WithoutRef + Omit: replace a native prop with a friendlier signature.
export type TextInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'onChange'> & {
  onChange: (value: string) => void;
};

export function TextInput({ onChange, ...rest }: TextInputProps) {
  return <input {...rest} onChange={(e) => onChange(e.currentTarget.value)} />;
}
