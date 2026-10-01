import { onWatcherCleanup, ref, watch } from 'vue';

type FetchUser = (id: number, signal: AbortSignal) => Promise<string>;

export function useUser(fetchUser: FetchUser) {
  const id = ref(1);
  const name = ref<string | null>(null);

  const handle = watch(
    id,
    async (userId) => {
      const controller = new AbortController();
      // 3.5: runs before the next run AND when the watcher stops.
      // Must be registered synchronously — before the first `await`.
      onWatcherCleanup(() => controller.abort());
      try {
        const result = await fetchUser(userId, controller.signal);
        if (!controller.signal.aborted) name.value = result; // ignore stale responses
      } catch (err) {
        if (!controller.signal.aborted) throw err;
      }
    },
    { immediate: true },
  );

  // handle() === handle.stop(); 3.5 also adds handle.pause() / handle.resume().
  return { id, name, stop: handle.stop };
}
