import type { Entry, SectionId } from './types';
import { SECTIONS } from './sections';
import { timingEntries } from './timing';
import { reactivityEntries } from './reactivity';
import { componentsEntries } from './components';
import { composablesEntries } from './composables';
import { vueTypingEntries } from './vue-typing';
import { sharedArrays, sharedSetsMaps, sharedTsFeatures } from './shared';
import { testingEntries } from './testing';
import { domA11yEntries } from './dom-a11y';

export { SECTIONS };
export type { Entry, SectionId };

const BY_SECTION: Record<SectionId, Entry[]> = {
  timing: timingEntries,
  reactivity: reactivityEntries,
  components: componentsEntries,
  composables: composablesEntries,
  'vue-typing': vueTypingEntries,
  arrays: sharedArrays,
  'sets-maps': sharedSetsMaps,
  'ts-features': sharedTsFeatures,
  testing: testingEntries,
  'dom-a11y': domA11yEntries,
};

/** All entries, in sidebar order. */
export const ENTRIES: readonly Entry[] = SECTIONS.flatMap((s) => BY_SECTION[s.id]);
