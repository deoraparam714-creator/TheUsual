import type { ReactNode } from 'react';

/** Page container: 16px gutter on phones (p.24), wider on desktop. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={['mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-12', className].filter(Boolean).join(' ')}>{children}</div>;
}

/** "01 — The idea" style eyebrow, as used throughout the guidelines. */
export function Eyebrow({ n, children, className }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={['t-label text-grind', className].filter(Boolean).join(' ')}>
      {n && <span>{n} — </span>}
      {children}
    </p>
  );
}

export function Dot({ mono = false }: { mono?: boolean }) {
  return <span aria-hidden className={mono ? 'dot dot-mono' : 'dot'} />;
}
