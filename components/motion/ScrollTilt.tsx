'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { useHydrated } from '@/hooks/useHydrated';

/** Starts tipped back in 3D and lands flat as it scrolls into place. */
export function ScrollTilt({ children, className, from = 14 }: { children: ReactNode; className?: string; from?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const active = hydrated && !reduce;
  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div className="h-full w-full origin-bottom will-change-transform" style={active ? { rotateX, scale } : undefined}>
        {children}
      </motion.div>
    </div>
  );
}
