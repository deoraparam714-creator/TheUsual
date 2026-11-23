'use client';

import { useEffect, useRef, useState } from 'react';
import type { Category } from '@/lib/menu';

/** Sticky category bar for the menu page. Highlights the section you're reading. */
export function MenuSectionsNav({ categories }: { categories: Pick<Category, 'id' | 'title'>[] }) {
  const [active, setActive] = useState(categories[0]?.id);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => {
      // The active section is the last one whose top has passed a line just under the sticky bars.
      const line = 150;
      let current = categories[0]?.id;
      for (const c of categories) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top - line <= 0) current = c.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories]);

  // Keep the active pill visible when the bar scrolls sideways on small phones.
  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const ul = list.current;
    if (!el || !ul || ul.scrollWidth <= ul.clientWidth) return;
    ul.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label="Menu sections" className="sticky top-[var(--header-h,0px)] z-30 border-y border-line bg-milk/90 backdrop-blur-md transition-[top] duration-500 ease-[var(--ease-out-expo)]">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-12">
        <ul ref={list} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-2">
          {categories.map((c) => {
            const on = c.id === active;
            return (
              <li key={c.id} data-id={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? 'location' : undefined}
                  className={[
                    'inline-flex min-h-10 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-300',
                    on ? 'bg-espresso text-milk' : 'text-espresso hover:bg-foam',
                  ].join(' ')}
                >
                  {c.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
