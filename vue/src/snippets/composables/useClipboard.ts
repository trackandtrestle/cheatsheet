import { onScopeDispose, readonly, shallowRef } from 'vue';

export function useClipboard(resetAfterMs = 1500) {
  const isSupported = typeof navigator !== 'undefined' && !!navigator.clipboard;
  const copied = shallowRef(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text); // needs a secure context + user gesture
    } catch {
      return false;
    }
    copied.value = true;
    clearTimeout(timer); // a second copy restarts the "Copied!" window
    timer = setTimeout(() => (copied.value = false), resetAfterMs);
    return true;
  }

  onScopeDispose(() => clearTimeout(timer)); // no state writes after unmount
  return { isSupported, copied: readonly(copied), copy };
}
