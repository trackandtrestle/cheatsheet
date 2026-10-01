import { describe, expect, it } from 'vitest';
import { useBrokenForm, useFormAssign, useFormRef } from './replaceReactive';

describe('replacing a reactive object', () => {
  it('breaks existing bindings', () => {
    const { summary, edit, reset } = useBrokenForm();
    edit('Ada');
    expect(summary.value).toBe('Ada');
    reset();
    expect(summary.value).toBe('Ada'); // stale: tracks the old proxy
    edit('Grace');
    expect(summary.value).toBe('Ada'); // still stale
  });

  it.each([
    ['Object.assign', useFormAssign],
    ['ref', useFormRef],
  ])('%s keeps bindings working', (_label, useForm) => {
    const { summary, edit, reset } = useForm();
    edit('Ada');
    reset();
    expect(summary.value).toBe('');
    edit('Grace');
    expect(summary.value).toBe('Grace');
  });
});
