import { SECTIONS } from '../content/sections';
import type { SectionId } from '../content/types';

interface SidebarProps {
  open: boolean;
  counts: Record<SectionId, number>;
  onNavigate: () => void;
}

export function Sidebar({ open, counts, onNavigate }: SidebarProps) {
  return (
    <nav id="sidebar" className={`sidebar${open ? ' open' : ''}`} aria-label="Sections">
      <ul>
        {SECTIONS.map((s) => {
          const n = counts[s.id];
          return (
            <li key={s.id}>
              {n > 0 ? (
                <a href={`#section-${s.id}`} onClick={onNavigate}>
                  <span>{s.title}</span>
                  <span className="count">{n}</span>
                </a>
              ) : (
                <span className="nav-empty" aria-disabled="true">
                  <span>{s.title}</span>
                  <span className="count">0</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
