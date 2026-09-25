import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  afterEach(() => localStorage.clear());

  it('reads an existing JSON value and persists updates (incl. updater fns)', () => {
    localStorage.setItem('prefs', JSON.stringify({ theme: 'dark', size: 14 }));
    const initial = { theme: 'light', size: 12 };
    const { result } = renderHook(() => useLocalStorage('prefs', initial));
    expect(result.current[0]).toEqual({ theme: 'dark', size: 14 });

    act(() => result.current[1]((p) => ({ ...p, size: p.size + 2 })));
    expect(result.current[0].size).toBe(16);
    expect(JSON.parse(localStorage.getItem('prefs') ?? 'null')).toEqual({ theme: 'dark', size: 16 });
  });

  it('falls back to the initial value on corrupt JSON', () => {
    localStorage.setItem('count', '{oops');
    const { result } = renderHook(() => useLocalStorage('count', 0));
    expect(result.current[0]).toBe(0);
  });

  it('syncs when another tab writes the same key', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => {
      localStorage.setItem('count', '42'); // simulate the other tab's write
      window.dispatchEvent(new StorageEvent('storage', { key: 'count', newValue: '42' }));
    });
    expect(result.current[0]).toBe(42);

    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: '1' })));
    expect(result.current[0]).toBe(42);
  });

  it('remove() clears storage and resets to initial', () => {
    const { result } = renderHook(() => useLocalStorage('name', 'anon'));
    act(() => result.current[1]('Ada'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('anon');
  });
});
