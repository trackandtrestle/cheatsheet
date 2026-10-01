/**
 * Framework-agnostic sections shared with the React edition (../src). Their snippets are plain
 * TypeScript, already type-checked and tested there.
 */
import type { Entry, SectionId } from './types';
import { arraysEntries } from '../../../src/content/arrays';
import { setsMapsEntries } from '../../../src/content/sets-maps.data';
import { tsFeaturesEntries } from '../../../src/content/ts-features';

type SharedFields = Pick<Entry, 'id' | 'title' | 'summary' | 'tags' | 'snippet' | 'gotchas'>;

// Copy only the framework-neutral fields; the React `Entry` also has a React-typed `Demo`.
const adopt = (entries: readonly SharedFields[], section: SectionId): Entry[] =>
  entries.map(({ id, title, summary, tags, snippet, gotchas }) => ({ id, section, title, summary, tags, snippet, gotchas }));

export const sharedArrays = adopt(arraysEntries, 'arrays');
export const sharedSetsMaps = adopt(setsMapsEntries, 'sets-maps');
export const sharedTsFeatures = adopt(tsFeaturesEntries, 'ts-features');
