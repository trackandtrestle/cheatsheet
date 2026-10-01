import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, useTemplateRef } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { useOnClickOutside } from './useOnClickOutside';

const onOutside = vi.fn();
const Panel = defineComponent({
  setup() {
    const panel = useTemplateRef<HTMLElement>('panel');
    useOnClickOutside(panel, (e) => onOutside(e.type));
    return () => h('div', [
      h('div', { ref: 'panel' }, [h('button', 'inside')]),
      h('button', 'outside'),
    ]);
  },
});

describe('useOnClickOutside', () => {
  it('fires for outside pointerdown and focus, not inside; stops on unmount', async () => {
    onOutside.mockClear();
    const { unmount } = render(Panel);
    await fireEvent.pointerDown(screen.getByRole('button', { name: 'inside' }));
    expect(onOutside).not.toHaveBeenCalled();

    await fireEvent.pointerDown(screen.getByRole('button', { name: 'outside' }));
    screen.getByRole('button', { name: 'outside' }).focus(); // keyboard Tab lands here
    expect(onOutside.mock.calls).toEqual([['pointerdown'], ['focusin']]);

    unmount();
    await fireEvent.pointerDown(document.body);
    expect(onOutside).toHaveBeenCalledTimes(2);
  });
});
