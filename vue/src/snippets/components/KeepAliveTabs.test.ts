import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, markRaw, onActivated, ref } from 'vue';
import KeepAliveTabs from './KeepAliveTabs.vue';

function counterPanel(name: string) {
  return markRaw(
    defineComponent({
      name,
      setup() {
        const clicks = ref(0);
        const activations = ref(0);
        onActivated(() => activations.value++); // runs on first mount too
        return () =>
          h('button', { onClick: () => clicks.value++ }, `${name}: ${clicks.value} clicks, ${activations.value} activations`);
      },
    }),
  );
}

const tabs = [
  { id: 'a', label: 'Alpha', component: counterPanel('Alpha') },
  { id: 'b', label: 'Beta', component: counterPanel('Beta') },
];

describe('<component :is> + KeepAlive', () => {
  it('keeps state of inactive tabs and fires onActivated on return', async () => {
    const user = userEvent.setup();
    render(KeepAliveTabs, { props: { tabs } });

    await user.click(screen.getByRole('button', { name: /Alpha: 0 clicks/ }));
    await user.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByRole('tabpanel', { name: 'Beta' })).toHaveTextContent('Beta: 0 clicks, 1 activations');

    await user.click(screen.getByRole('tab', { name: 'Alpha' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Alpha: 1 clicks, 2 activations');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
  });
});
