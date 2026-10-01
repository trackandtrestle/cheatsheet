import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, inject, Teleport, type InjectionKey, type Plugin } from 'vue';

const LocaleKey: InjectionKey<string> = Symbol('locale');
const TKey: InjectionKey<(key: string) => string> = Symbol('t');
const i18n: Plugin<[messages: Record<string, string>]> = {
  install: (app, messages) => app.provide(TKey, (k) => messages[k] ?? k),
};

const Modal = defineComponent(() => {
  const locale = inject(LocaleKey, 'en');
  const t = inject(TKey, (k: string) => k);
  return () => h(Teleport, { to: 'body' }, h('div', { role: 'dialog', lang: locale }, t('hi')));
});

describe('global mounting options', () => {
  it('stubs Teleport, provides values, installs plugins', () => {
    const wrapper = mount(Modal, {
      global: {
        stubs: { teleport: true }, // <teleport-stub> renders children in place
        provide: { [LocaleKey]: 'fr' }, // what an ancestor would provide()
        plugins: [[i18n, { hi: 'Bonjour' }]], // [plugin, ...options]
      },
    });
    const dialog = wrapper.get('[role="dialog"]');
    expect(dialog.attributes('lang')).toBe('fr');
    expect(dialog.text()).toBe('Bonjour');
  });

  it('without the stub, content is teleported OUT of the wrapper', () => {
    const wrapper = mount(Modal, { attachTo: document.body });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    expect(document.body.querySelector('[role="dialog"]')).toHaveTextContent('hi');
    wrapper.unmount(); // attachTo: always clean up
  });
});
