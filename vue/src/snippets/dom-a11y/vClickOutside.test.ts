import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref, withDirectives } from 'vue';
import { vClickOutside } from './vClickOutside';

const onOutside = vi.fn();
const Popover = defineComponent(() => {
  const showItem = ref(true);
  return () => [
    h('button', 'Outside'),
    withDirectives( // what `v-click-outside="onOutside"` compiles to
      h('div', { role: 'dialog', 'aria-label': 'Menu' }, [
        showItem.value && h('button', { onPointerdown: () => (showItem.value = false) }, 'Remove me'),
      ]),
      [[vClickOutside, onOutside]],
    ),
  ];
});

describe('v-click-outside', () => {
  it('fires for clicks outside only, even if the target is removed mid-click', async () => {
    const user = userEvent.setup();
    const { unmount } = render(Popover);
    await user.click(screen.getByRole('button', { name: 'Remove me' }));
    expect(onOutside).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(onOutside).toHaveBeenCalledOnce();

    unmount(); // listener removed
    await user.click(document.body);
    expect(onOutside).toHaveBeenCalledOnce();
  });
});
