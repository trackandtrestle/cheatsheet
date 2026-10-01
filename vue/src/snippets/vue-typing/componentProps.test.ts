import { describe, expectTypeOf, it } from 'vitest';
import Alert from './Alert.vue';
import FocusInput from './FocusInput.vue';
import SelectList from './SelectList.vue';
import { ProgressBar, type Segment } from './ProgressBar';
import type { ComponentExposed, ComponentProps } from './componentProps';

describe('extracting props from components', () => {
  it('works for <script setup> SFCs', () => {
    type Tone = NonNullable<ComponentProps<typeof Alert>['tone']>;
    expectTypeOf<Tone>().toEqualTypeOf<'info' | 'success' | 'danger'>();
    expectTypeOf<ComponentProps<typeof Alert>['title']>().toEqualTypeOf<string>();
  });

  it('works for defineComponent with runtime props', () => {
    expectTypeOf<ComponentProps<typeof ProgressBar>['segments']>().toEqualTypeOf<Segment[]>();
  });

  it('works for generic SFCs (T falls back to its constraint)', () => {
    expectTypeOf<ComponentProps<typeof SelectList>['label']>().toEqualTypeOf<string>();
    expectTypeOf<ComponentProps<typeof SelectList>['items']>().toEqualTypeOf<readonly { id: string | number }[]>();
  });

  it('extracts the exposed instance', () => {
    expectTypeOf<ComponentExposed<typeof FocusInput>['focus']>().toEqualTypeOf<() => void>();
  });
});
