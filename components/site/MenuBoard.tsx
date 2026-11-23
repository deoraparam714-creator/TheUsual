'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ItemImage } from '@/components/menu/ItemImage';
import { inr } from '@/lib/format';
import { type Category, type MenuItem, proteinLabel } from '@/lib/menu';

/**
 * One category of the text-first menu. On desktop a sticky photo panel shows
 * whichever row you're on; on phones each row carries its own thumbnail.
 */
export function MenuBoard({ category, items, index }: { category: Category; items: MenuItem[]; index: number }) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <section id={category.id} className="scroll-mt-28 border-t border-line py-12 md:scroll-mt-36 md:py-24" aria-labelledby={`${category.id}-title`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="t-label text-grind">
              {String(index + 1).padStart(2, '0')} · {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
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
            <li key={item.id} className="reveal border-b border-line first:border-t last:border-b-0" onMouseEnter={() => setActive(item.id)} onFocus={() => setActive(item.id)}>
              <Link href={`/order?item=${item.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-x-4 py-5 md:gap-x-6 md:py-8">
                <div className="flex min-w-0 items-center gap-4">
                  <ItemImage item={item} sizes="80px" compact className="size-[72px] shrink-0 rounded-[12px] md:hidden" />
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.01em] md:text-[1.75rem]">{item.name}</h3>
                    {item.protein ? <p className="mt-1.5 inline-flex rounded-full bg-lime px-2.5 py-0.5 text-[0.6875rem] font-bold text-espresso">{proteinLabel(item)}</p> : null}
                    <p className="mt-1 text-[0.875rem] leading-snug text-grind md:text-[0.9375rem]">{item.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2.5 md:flex-row md:items-center md:gap-5">
                  <span aria-hidden className="font-display text-lg font-semibold tabular-nums md:text-2xl">{inr(item.price)}</span>
                  <span
                    aria-hidden
                    className="grid size-9 place-items-center rounded-full bg-espresso text-milk transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90 md:size-11"
                  >
                    <svg viewBox="0 0 16 16" className="size-3.5 md:size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
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
