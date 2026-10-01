import { describe, expect, it } from 'vitest';
import { computed } from 'vue';
import { useFilters, useForm } from './refVsReactive';

describe('ref vs reactive', () => {
  it('ref tracks deep mutations and whole-value replacement', () => {
    const { filters, addTag, reset } = useFilters();
    const tagCount = computed(() => filters.value.tags.length);
    addTag('vue');
    expect(tagCount.value).toBe(1);
    reset();
    expect(tagCount.value).toBe(0);
  });

  it('reactive is reset by mutating in place, keeping the same proxy', () => {
    const { form, reset } = useForm();
    const before = form;
    const name = computed(() => form.name);
    form.name = 'Ada';
    expect(name.value).toBe('Ada');
    reset();
    expect(name.value).toBe('');
    expect(form).toBe(before);
  });
});
