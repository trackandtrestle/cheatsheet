import type { Entry, SectionId } from './types';
import { SECTIONS } from './sections';
import { timingEntries } from './timing';
import { arraysEntries } from './arrays';
import { setsMapsEntries } from './sets-maps';
import { immutableStateEntries } from './immutable-state';
import { tsFeaturesEntries } from './ts-features';
import { reactTypingEntries } from './react-typing';
import { reactFeaturesEntries } from './react-features';
import { testingEntries } from './testing';
import { domA11yEntries } from './dom-a11y';

export { SECTIONS };
export type { Entry, SectionId };

const BY_SECTION: Record<SectionId, Entry[]> = {
  timing: timingEntries,
  arrays: arraysEntries,
  'sets-maps': setsMapsEntries,
  'immutable-state': immutableStateEntries,
  'ts-features': tsFeaturesEntries,
  'react-typing': reactTypingEntries,
  'react-features': reactFeaturesEntries,
  testing: testingEntries,
  'dom-a11y': domA11yEntries,
};

/** All entries, in sidebar order. */
export const ENTRIES: readonly Entry[] = SECTIONS.flatMap((s) => BY_SECTION[s.id]);
