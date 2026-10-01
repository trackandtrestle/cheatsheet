import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { SnippetLang } from '../content/types';

let highlighter: Promise<HighlighterCore> | undefined;

/** One shared highlighter, loaded lazily with only the grammars and themes we use. */
function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= createHighlighterCore({
    themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark-dimmed.mjs')],
    langs: [import('shiki/langs/typescript.mjs'), import('shiki/langs/vue.mjs')],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/**
 * Highlight to HTML with both themes baked in as CSS variables (`--shiki-light` / `--shiki-dark`),
 * so toggling the theme is pure CSS and never re-highlights.
 */
export async function highlight(code: string, lang: SnippetLang): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: lang === 'vue' ? 'vue' : 'typescript',
    themes: { light: 'github-light', dark: 'github-dark-dimmed' },
    defaultColor: false,
  });
}
