import { defineAsyncComponent, h, type AsyncComponentLoader, type FunctionalComponent } from 'vue';

const Loading: FunctionalComponent = () => h('p', { role: 'status' }, 'Loading…');
const Failed: FunctionalComponent<{ error: Error }> = ({ error }) =>
  h('p', { role: 'alert' }, `Failed to load: ${error.message}`);

/** Usage: `const Chart = lazy(() => import('./Chart.vue'))` → its own chunk. */
export function lazy(loader: AsyncComponentLoader, retries = 1) {
  return defineAsyncComponent({
    loader,
    loadingComponent: Loading,
    errorComponent: Failed,
    delay: 200, // no spinner flash on fast loads
    timeout: 10_000, // then render errorComponent
    onError(error, retry, fail, attempts) {
      if (attempts <= retries) retry();
      else fail();
    },
  });
}
