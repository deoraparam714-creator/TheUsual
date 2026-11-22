'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ItemImage } from '@/components/menu/ItemImage';
import { inr } from '@/lib/format';
import type { Category, MenuItem } from '@/lib/menu';

/**
 * One category of the text-first menu. On desktop a sticky photo panel shows
 * whichever row you're on; on phones each row carries its own thumbnail.
 */
export function MenuBoard({ category, items, index }: { category: Category; items: MenuItem[]; index: number }) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <section id={category.id} className="scroll-mt-32 border-t border-line py-16 md:py-24" aria-labelledby={`${category.id}-title`}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="t-label text-grind">{String(index + 1).padStart(2, '0')} — {category.title}</p>
            <h2 id={`${category.id}-title`} className="t-headline mt-4">
              {category.title}
              <span className="dot" aria-hidden />
            </h2>
            <p className="mt-4 max-w-[32ch] text-grind">{category.blurb}</p>
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[18px] bg-toast md:block">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]"
                  style={{ opacity: item.id === current?.id ? 1 : 0, transform: item.id === current?.id ? 'scale(1)' : 'scale(1.03)' }}
                  aria-hidden={item.id !== current?.id}
                >
                  <ItemImage item={item} sizes="40vw" className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <ul className="md:col-span-7 md:pt-24">
          {items.map((item) => (
            <li key={item.id} className="reveal border-b border-line first:border-t" onMouseEnter={() => setActive(item.id)} onFocus={() => setActive(item.id)}>
              <Link href={`/order?item=${item.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-6 md:py-8">
                <div className="flex min-w-0 items-center gap-4">
                  <ItemImage item={item} sizes="80px" compact className="size-[72px] shrink-0 rounded-[10px] md:hidden" />
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.01em] md:text-[1.75rem]">{item.name}</h3>
                    <p className="mt-1 text-[0.9375rem] text-grind">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-xl font-semibold tabular-nums md:text-2xl">{item.price}</span>
                  <span
                    aria-hidden
                    className="grid size-11 place-items-center rounded-full bg-espresso text-milk transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90"
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="sr-only">
                    {inr(item.price)}. Add {item.name} to your order
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
