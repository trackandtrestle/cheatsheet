import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from './TypedContext';
import type { Auth } from './TypedContext';

describe('typed context with a non-null hook', () => {
  it('throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used inside <AuthProvider>');
    vi.restoreAllMocks();
  });

  it('returns a non-null value inside the provider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expectTypeOf(result.current).toEqualTypeOf<Auth>();
    expect(result.current.user).toBeNull();
    act(() => result.current.login('ada'));
    expect(result.current.user).toBe('ada');
    act(() => result.current.logout());
    expect(result.current.user).toBeNull();
  });
});
