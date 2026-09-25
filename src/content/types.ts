import type { FC } from 'react';

export type SectionId =
  | 'timing'
  | 'arrays'
  | 'sets-maps'
  | 'immutable-state'
  | 'ts-features'
  | 'react-typing'
  | 'react-features'
  | 'testing'
  | 'dom-a11y';

export interface Entry {
  /** Globally unique, URL-safe. Used as the hash deep link. */
  id: string;
  section: SectionId;
  title: string;
  /** 1–2 sentences. */
  summary: string;
  tags: string[];
  /** Raw source of the snippet file (via `?raw` import). */
  snippet: string;
  gotchas?: string[];
  Demo?: FC;
  /** Open the demo on first render (used by the showcase visualizer). */
  demoOpen?: boolean;
}

export interface Section {
  id: SectionId;
  title: string;
  blurb: string;
}
