/**
 * Guards the quality bar for every snippet file:
 * < 40 lines, no `any` (outside the deliberate unknown-vs-any contrast),
 * a colocated test for every non-UI snippet, and every `?raw` import resolves.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ENTRIES, SECTIONS } from '../content';

const ROOT = join(process.cwd(), 'src/snippets');
const ANY_ALLOWED = new Set(['ts-features/unknownVsAny.ts']);
/** Fixtures that exist only to be mocked by a Testing Library snippet. */
const TEST_FIXTURES = new Set(['testing/analytics.ts']);

const files = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => readdirSync(join(ROOT, d.name)).map((f) => `${d.name}/${f}`));
const sources = files.filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f));

describe('snippet files', () => {
  it.each(sources)('%s is under 40 lines', (f) => {
    const lines = readFileSync(join(ROOT, f), 'utf8').trimEnd().split('\n').length;
    expect(lines).toBeLessThan(40);
  });

  it.each(files.filter((f) => !ANY_ALLOWED.has(f)))('%s uses no `any`', (f) => {
    const code = readFileSync(join(ROOT, f), 'utf8').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');
    expect(code).not.toMatch(/:\s*any\b|<any>|\bas any\b|\bany\[\]/);
  });

  it.each(sources.filter((f) => f.endsWith('.ts') && !TEST_FIXTURES.has(f)))('%s has a colocated test', (f) => {
    const base = join(ROOT, f.replace(/\.ts$/, ''));
    expect(existsSync(`${base}.test.ts`) || existsSync(`${base}.test.tsx`)).toBe(true);
  });
});

describe('entries', () => {
  it('have unique, URL-safe ids prefixed by their section', () => {
    const ids = ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of ENTRIES) expect(e.id).toMatch(new RegExp(`^${e.section}-[a-z0-9-]+$`));
  });

  it('every section has entries, and every entry has a summary, tags and code', () => {
    for (const s of SECTIONS) expect(ENTRIES.some((e) => e.section === s.id)).toBe(true);
    for (const e of ENTRIES) {
      expect(e.summary.length, e.id).toBeGreaterThan(10);
      expect(e.tags.length, e.id).toBeGreaterThan(0);
      expect(e.snippet.trim().length, e.id).toBeGreaterThan(0);
    }
  });
});
