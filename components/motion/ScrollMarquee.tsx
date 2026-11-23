'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useHydrated } from '@/hooks/useHydrated';

/** A ribbon of words that slides sideways as you scroll down the page. */
export function ScrollMarquee({ items, reverse = false, muted = false, className }: { items: string[]; reverse?: boolean; muted?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ['-30%', '0%'] : ['0%', '-30%']);
  const run = [...items, ...items, ...items];
  return (
    <div ref={ref} className={['overflow-hidden whitespace-nowrap', className].filter(Boolean).join(' ')} aria-hidden>
      <motion.div className="inline-flex gap-8 will-change-transform md:gap-12" style={hydrated && !reduce ? { x } : undefined}>
        {run.map((t, i) => (
          <span
            key={i}
            className={['font-display text-[clamp(2.5rem,9vw,7rem)] font-extrabold uppercase leading-none tracking-[-0.03em]', muted ? 'opacity-25' : ''].join(' ')}
          >
            {t}
            <span className="mx-6 inline-block size-[0.22em] rounded-full bg-lime align-middle md:mx-10" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
