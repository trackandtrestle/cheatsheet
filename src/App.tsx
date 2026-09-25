import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { ENTRIES, SECTIONS } from './content';
import type { Entry, SectionId } from './content/types';
import { EntryCard } from './components/EntryCard';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { buildIndex, search } from './lib/search';
import { useHash } from './lib/useHash';
import { useTheme } from './lib/useTheme';

export interface AppProps {
  entries?: readonly Entry[];
}

export function App({ entries = ENTRIES }: AppProps) {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [navOpen, setNavOpen] = useState(false);
  const hash = useHash();
  const searchRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildIndex(entries), [entries]);
  const results = useMemo(() => search(index, deferredQuery), [index, deferredQuery]);

  const grouped = useMemo(() => {
    const map = new Map<SectionId, Entry[]>();
    for (const e of results) {
      const list = map.get(e.section);
      if (list) list.push(e);
      else map.set(e.section, [e]);
    }
    return map;
  }, [results]);

  // "/" focuses search from anywhere that isn't already a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Deep link: if the target is hidden by the current search, clear the search first.
  const hashTargetsEntry = entries.some((e) => e.id === hash);
  const hashHidden = hashTargetsEntry && !results.some((e) => e.id === hash);
  useEffect(() => {
    if (hashHidden) setQuery('');
  }, [hashHidden, hash]);

  useEffect(() => {
    if (!hash || hashHidden) return;
    const el = document.getElementById(hash);
    if (!el) return;
    el.scrollIntoView?.({ block: 'start' });
    if (hashTargetsEntry) el.focus({ preventScroll: true });
  }, [hash, hashHidden, hashTargetsEntry]);

  const counts = useMemo(() => {
    const c = {} as Record<SectionId, number>;
    for (const s of SECTIONS) c[s.id] = grouped.get(s.id)?.length ?? 0;
    return c;
  }, [grouped]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <button
          type="button"
          className="btn nav-toggle"
          aria-expanded={navOpen}
          aria-controls="sidebar"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span aria-hidden="true">☰</span>
          <span className="visually-hidden">Sections</span>
        </button>
        <h1 className="brand">
          <a href="#">TS + React Cheat Sheet</a>
        </h1>
        <SearchBar ref={searchRef} value={query} onChange={setQuery} resultCount={results.length} total={entries.length} />
        <button
          type="button"
          className="btn theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
      </header>

      <div className="layout">
        <Sidebar open={navOpen} counts={counts} onNavigate={() => setNavOpen(false)} />
        <main id="main" className="content" tabIndex={-1}>
          {results.length === 0 && (
            <p className="empty">
              No entries match <strong>“{deferredQuery}”</strong>.{' '}
              <button type="button" className="btn btn-small" onClick={() => setQuery('')}>
                Clear search
              </button>
            </p>
          )}
          {SECTIONS.map((section) => {
            const list = grouped.get(section.id);
            if (!list) return null;
            return (
              <section key={section.id} id={`section-${section.id}`} className="section" aria-labelledby={`h-${section.id}`}>
                <h2 id={`h-${section.id}`}>
                  {section.title} <span className="count">{list.length}</span>
                </h2>
                {!deferredQuery && <p className="blurb">{section.blurb}</p>}
                {list.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} theme={theme} active={entry.id === hash} />
                ))}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
