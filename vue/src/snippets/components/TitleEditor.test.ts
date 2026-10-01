import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import TitleEditor from './TitleEditor.vue';

function renderHost(modifiers: { capitalize?: true }) {
  const title = ref('');
  const body = ref('');
  // <TitleEditor v-model:title.capitalize="title" v-model:body="body" />
  const Host = defineComponent(() => () =>
    h(TitleEditor, {
      title: title.value,
      'onUpdate:title': (v: string) => (title.value = v),
      titleModifiers: modifiers,
      body: body.value,
      'onUpdate:body': (v: string) => (body.value = v),
    }),
  );
  render(Host);
  return { title, body };
}

describe('named defineModel + modifiers', () => {
  it('applies the custom .capitalize modifier in the setter', async () => {
    const { title, body } = renderHost({ capitalize: true });
    await userEvent.type(screen.getByLabelText('Title'), 'hello');
    await userEvent.type(screen.getByLabelText('Body'), 'text');
    expect(title.value).toBe('Hello');
    expect(body.value).toBe('text');
  });

  it('leaves the value alone without the modifier', async () => {
    const { title } = renderHost({});
    await userEvent.type(screen.getByLabelText('Title'), 'hello');
    expect(title.value).toBe('hello');
  });
});
