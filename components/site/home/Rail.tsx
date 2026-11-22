'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Horizontal scroll-snap rail with prev/next controls on larger screens. */
export function Rail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-12 md:mt-16">
      <ul
        ref={ref}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:gap-6 md:scroll-px-8 md:px-8 xl:scroll-px-12 xl:px-12 [@media(min-width:1440px)]:px-[calc((100vw-1440px)/2+3rem)]"
      >
        {children}
      </ul>
      <div className="mx-auto mt-8 hidden max-w-[1440px] justify-end gap-2 px-8 md:flex xl:px-12">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => go(d)}
            disabled={d === -1 ? atStart : atEnd}
            aria-label={d === -1 ? 'Previous items' : 'Next items'}
            className="grid size-12 place-items-center rounded-full border border-espresso transition-colors duration-300 hover:bg-espresso hover:text-milk disabled:cursor-default disabled:border-line-strong disabled:text-line-strong disabled:hover:bg-transparent"
          >
            <svg viewBox="0 0 16 16" className={['size-4', d === -1 ? 'rotate-180' : ''].join(' ')} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
