import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import Card from './Card.vue';

describe('default + named slots', () => {
  it('renders each slot in its place', () => {
    // <Card><template #header>Plans</template>Body<template #footer>…</template></Card>
    render(Card, {
      slots: {
        header: () => 'Plans',
        default: () => h('p', 'Pick one'),
        footer: () => h('button', 'Upgrade'),
      },
    });
    expect(screen.getByRole('article', { name: 'Plans' })).toHaveTextContent('Pick one');
    expect(screen.getByRole('contentinfo')).toContainElement(screen.getByRole('button', { name: 'Upgrade' }));
  });

  it('uses fallback content and omits the empty footer', () => {
    render(Card, { slots: { default: () => 'Body' } });
    expect(screen.getByRole('article', { name: 'Untitled' })).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeNull();
  });
});
