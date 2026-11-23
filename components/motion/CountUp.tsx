'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useHydrated } from '@/hooks/useHydrated';

/** Counts up from 0 when it scrolls into view. Server HTML shows the final number. */
export function CountUp({ to, duration = 1.6, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (!hydrated || reduce || started.current) return;
    if (!inView) {
      setValue(0);
      return;
    }
    started.current = true;
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [hydrated, inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      <span aria-hidden className="tabular-nums">{value}</span>
    </span>
  );
}
