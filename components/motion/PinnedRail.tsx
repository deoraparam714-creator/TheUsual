'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Desktop: the section pins and its cards slide sideways as you scroll down.
 * Phones, tablets and reduced-motion users get `fallback` (a normal swipeable rail).
 */
export function PinnedRail({ header, items, fallback, className }: { header: ReactNode; items: ReactNode; fallback: ReactNode; className?: string }) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduce = useReducedMotion();
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const pinned = desktop && !reduce;

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  if (!pinned) {
    return (
      <div className={className}>
        {header}
        {fallback}
      </div>
    );
  }

  return (
    <div ref={section} className={['relative', className].filter(Boolean).join(' ')} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {header}
        <motion.ul ref={track} style={{ x }} className="mt-12 flex w-max gap-6 px-8 will-change-transform xl:px-12 [@media(min-width:1440px)]:px-[calc((100vw-1440px)/2+3rem)]">
          {items}
        </motion.ul>
      </div>
    </div>
  );
}
