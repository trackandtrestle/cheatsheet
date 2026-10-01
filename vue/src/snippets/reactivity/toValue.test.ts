import { describe, expect, it } from 'vitest';
import { reactive, ref } from 'vue';
import { describeInput, useTitle } from './toValue';

describe('toValue / MaybeRefOrGetter', () => {
  it('accepts plain values, refs and getters', () => {
    expect(useTitle('Home').value).toBe('Home · My App');

    const page = ref('Inbox');
    const fromRef = useTitle(page);
    page.value = 'Sent';
    expect(fromRef.value).toBe('Sent · My App');

    const props = reactive({ name: 'Ada' });
    const fromGetter = useTitle(() => props.name, 'Profiles');
    props.name = 'Grace';
    expect(fromGetter.value).toBe('Grace · Profiles');
  });

  it('isRef narrows, unref unwraps', () => {
    expect(describeInput(ref(1))).toBe('ref(1)');
    expect(describeInput(2)).toBe('plain(2)');
  });
});
