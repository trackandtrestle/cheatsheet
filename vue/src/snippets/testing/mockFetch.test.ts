import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, onMounted, ref } from 'vue';

const UserName = defineComponent({
  props: { id: { type: Number, required: true } },
  setup(props) {
    const text = ref('loading');
    onMounted(async () => {
      const res = await fetch(`/api/users/${props.id}`);
      text.value = res.ok ? ((await res.json()) as { name: string }).name : `error: ${res.statusText}`;
    });
    return () => h('p', text.value);
  },
});

describe('mocking fetch', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // undoes spyOn…
    vi.unstubAllGlobals(); // …but NOT stubGlobal
  });

  it('spyOn(globalThis, "fetch") with a real Response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ name: 'Ada' }));
    render(UserName, { props: { id: 1 } });
    expect(await screen.findByText('Ada')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('/api/users/1');
  });

  it('vi.stubGlobal for error paths (fresh Response per call)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 404, statusText: 'Not Found' })));
    render(UserName, { props: { id: 2 } });
    expect(await screen.findByText('error: Not Found')).toBeInTheDocument();
  });
});
