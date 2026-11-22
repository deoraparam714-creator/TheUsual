'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { formatHours, locations, nav, site } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        setHidden(y > 240 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y < 240) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Publish the header's visible height so sticky sub-navs can sit right under it.
  useEffect(() => {
    const set = () => {
      const h = hidden ? 0 : window.innerWidth >= 768 ? 80 : 64;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, [hidden]);

  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lenis]);

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          scrolled && !open ? 'border-b border-line bg-milk/85 backdrop-blur-md' : 'border-b border-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-8 xl:px-12">
          <Link href="/" className={['relative z-10 -m-3 p-3 transition-colors duration-500', open ? 'text-milk' : 'text-espresso'].join(' ')} aria-label="the usual — home">
            <Logo variant="oneline" className="h-[22px] w-auto md:h-[26px]" decorative />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className="link-underline relative py-1 text-[0.9375rem] font-medium">
                  {item.label}
                  {active && <span aria-hidden className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-lime" />}
                </Link>
              );
            })}
            <ButtonLink href="/order" variant="lime" size="sm" className="px-5">
              Order my usual
            </ButtonLink>
          </nav>

          <div className="relative z-10 flex items-center gap-2 md:hidden">
            {!open && (
              <ButtonLink href="/order" variant="lime" size="sm" className="!min-h-10 px-4 text-[0.8125rem]">
                Order
              </ButtonLink>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={['grid size-11 place-items-center rounded-full transition-colors', open ? 'text-milk' : 'text-espresso'].join(' ')}
            >
              <span className="relative block h-3 w-6">
                <span className={['absolute left-0 h-[1.5px] w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]', open ? 'top-1.5 rotate-45' : 'top-0'].join(' ')} />
                <span className={['absolute left-0 h-[1.5px] w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]', open ? 'top-1.5 -rotate-45' : 'top-3'].join(' ')} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="on-dark fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-espresso px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20 text-milk md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ href: '/', label: 'Home' }, ...nav, { href: '/order', label: 'Order' }].map((item, i) => (
                <motion.div key={item.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.8, ease: EASE }} className="border-b border-milk/12">
                  <Link href={item.href} className="flex items-baseline justify-between py-3.5 font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.03em]">
                    <span>
                      {item.label}
                      {pathname === item.href && <span className="dot" aria-hidden />}
                    </span>
                    <span className="t-label text-milk/40">{String(i + 1).padStart(2, '0')}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-auto space-y-5">
              <ul className="space-y-1.5 pt-8 text-sm text-milk/70 [@media(max-height:700px)]:hidden">
                {locations.map((l) => (
                  <li key={l.id} className="flex justify-between gap-4">
                    <span>{l.name}</span>
                    <span className="text-milk/50">{formatHours(l.hours)}</span>
                  </li>
                ))}
              </ul>
              <p className="font-display text-3xl font-extrabold tracking-[-0.02em]">
                Same time <span className="accent">tomorrow?</span>
              </p>
              <p className="text-xs text-milk/45">{site.descriptor} · {site.city}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
