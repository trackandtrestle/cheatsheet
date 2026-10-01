/**
 * Guards the quality bar for every Vue snippet file:
 * < 40 lines (template included), no `any`, a colocated test for every `.ts` snippet,
 * `lang: 'vue'` on SFC entries, and unique `section-slug` ids.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ENTRIES, SECTIONS } from '../content';

const ROOT = join(process.cwd(), 'src/snippets');
/** Fixtures that exist only to be mocked by a Testing snippet. */
const TEST_FIXTURES = new Set(['testing/analytics.ts']);

const files = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(join(ROOT, d.name)).map((f) => `${d.name}/${f}`));
const sources = files.filter((f) => /\.(ts|vue)$/.test(f) && !/\.test\.ts$/.test(f));

describe('snippet files', () => {
  it.each(sources)('%s is under 40 lines', (f) => {
    const lines = readFileSync(join(ROOT, f), 'utf8').trimEnd().split('\n').length;
    expect(lines).toBeLessThan(40);
  });

  it.each(files)('%s uses no `any`', (f) => {
    const code = readFileSync(join(ROOT, f), 'utf8').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');
    expect(code).not.toMatch(/:\s*any\b|<any>|\bas any\b|\bany\[\]/);
  });

  it.each(sources.filter((f) => f.endsWith('.ts') && !TEST_FIXTURES.has(f)))('%s has a colocated test', (f) => {
    const base = join(ROOT, f.replace(/\.ts$/, ''));
    expect(existsSync(`${base}.test.ts`)).toBe(true);
  });
});

describe('entries', () => {
  it('have unique, URL-safe ids prefixed by their section', () => {
    const ids = ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of ENTRIES) expect(e.id).toMatch(new RegExp(`^${e.section}-[a-z0-9-]+$`));
  });

  it('every section has entries; every entry has a summary, tags and code', () => {
    for (const s of SECTIONS) expect(ENTRIES.some((e) => e.section === s.id), s.id).toBe(true);
    for (const e of ENTRIES) {
      expect(e.summary.length, e.id).toBeGreaterThan(10);
      expect(e.tags.length, e.id).toBeGreaterThan(0);
      expect(e.snippet.trim().length, e.id).toBeGreaterThan(0);
    }
  });

  it('SFC snippets are highlighted as vue', () => {
    for (const e of ENTRIES) {
      const looksLikeSfc = /^<(script|template)\b/m.test(e.snippet);
      expect(e.lang === 'vue', e.id).toBe(looksLikeSfc);
    }
  });
});
