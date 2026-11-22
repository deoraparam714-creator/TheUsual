'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { useHydrated } from '@/hooks/useHydrated';

/** Gentle vertical drift while the element crosses the viewport. */
export function Parallax({ children, className, amount = 60 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  // Only attach the scroll-linked transform after hydration so SSR markup matches.
  const active = hydrated && !reduce;
  return (
    <div ref={ref} className={['overflow-hidden', className].filter(Boolean).join(' ')}>
      <motion.div
        style={{ y: active ? y : 0, height: active ? `calc(100% + ${amount * 2}px)` : '100%', marginTop: active ? -amount : 0 }}
        className="relative w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
