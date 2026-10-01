import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, inject } from 'vue';
import ThemeProvider, { themeKey } from './ThemeProvider.vue';

// Any descendant, however deep, can inject without prop drilling.
const ThemeButton = defineComponent(() => {
  const ctx = inject(themeKey);
  if (!ctx) throw new Error('ThemeButton needs a ThemeProvider');
  return () => h('button', { onClick: ctx.toggle }, `Theme: ${ctx.theme.value}`);
});

describe('provide / inject', () => {
  it('injects reactive state and updates consumers', async () => {
    render(ThemeProvider, { props: { initial: 'dark' }, slots: { default: () => h('div', h(ThemeButton)) } });
    const button = screen.getByRole('button', { name: 'Theme: dark' });
    await userEvent.click(button);
    expect(button).toHaveTextContent('Theme: light');
  });

  it('inject without a provider returns undefined', () => {
    expect(() => render(ThemeButton)).toThrow('needs a ThemeProvider');
  });
});
