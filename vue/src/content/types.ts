import type { Component } from 'vue';

export type SectionId =
  | 'timing'
  | 'reactivity'
  | 'components'
  | 'composables'
  | 'vue-typing'
  | 'arrays'
  | 'sets-maps'
  | 'ts-features'
  | 'testing'
  | 'dom-a11y';

export type SnippetLang = 'ts' | 'vue';

export interface Entry {
  /** Globally unique, URL-safe. Used as the hash deep link. */
  id: string;
  section: SectionId;
  title: string;
  /** 1–2 sentences. Inline `code` in backticks is rendered as code. */
  summary: string;
  tags: string[];
  /** Raw source of the snippet file (via `?raw` import). */
  snippet: string;
  /** Highlighting grammar. Defaults to `ts`; use `vue` for SFC snippets. */
  lang?: SnippetLang;
  gotchas?: string[];
  Demo?: Component;
  /** Open the demo on first render and place it above the code (the showcase). */
  demoOpen?: boolean;
}

export interface Section {
  id: SectionId;
  title: string;
  blurb: string;
}
