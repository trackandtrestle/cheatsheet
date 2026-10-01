import { onBeforeUnmount, onMounted, shallowRef, type ShallowRef } from 'vue';

// A ticking clock. Timers start in onMounted, which never runs during SSR,
// so the server renders one snapshot and no interval leaks on the server.
export function useNow(intervalMs = 1000): Readonly<ShallowRef<Date>> {
  const now = shallowRef(new Date());
  let id: ReturnType<typeof setInterval> | undefined;

  onMounted(() => {
    now.value = new Date(); // refresh after hydration
    id = setInterval(() => (now.value = new Date()), intervalMs);
  });
  onBeforeUnmount(() => clearInterval(id));

  return now;
}
