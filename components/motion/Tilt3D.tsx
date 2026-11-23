'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Pointer-driven 3D tilt with a soft light sheen that follows the cursor.
 * Mouse and trackpad only; touch screens and reduced-motion users get a still card.
 */
export function Tilt3D({ children, className, max = 8, sheen = true }: { children: ReactNode; className?: string; max?: number; sheen?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 170, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgb(255 255 255 / 0.28), transparent 55%)`);
  const glareOpacity = useSpring(0, spring);

  if (reduce || !finePointer) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
          glareOpacity.set(1);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
          glareOpacity.set(0);
        }}
      >
        {children}
        {sheen && <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light" style={{ background: glare, opacity: glareOpacity }} />}
      </motion.div>
    </div>
  );
}
