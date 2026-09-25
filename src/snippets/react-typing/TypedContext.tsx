import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface Auth {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
}

// `null` = "no provider". Avoid a fake default full of no-op functions.
const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const value = useMemo<Auth>(
    () => ({ user, login: setUser, logout: () => setUser(null) }),
    [user],
  );
  return <AuthContext value={value}>{children}</AuthContext>; // React 19: no .Provider
}

// The hook removes `null` once, so every consumer gets a non-null Auth.
export function useAuth(): Auth {
  const ctx = useContext(AuthContext);
  if (ctx === null) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
