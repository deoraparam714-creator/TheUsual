'use client';

import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useHydrated } from '@/hooks/useHydrated';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** Sticky footer (e.g. the add-to-order button). */
  footer?: ReactNode;
  wide?: boolean;
};

/** Bottom sheet on phones (drag down to close), centred dialog on larger screens. */
export function Sheet({ open, onClose, label, children, footer, wide = false }: Props) {
  const hydrated = useHydrated();
  const desktop = useMediaQuery('(min-width: 768px)');
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => panel.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
      restoreFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!hydrated) return null;

  const variants = desktop
    ? { initial: { opacity: 0, y: 24, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={['fixed inset-0 z-[70] flex', desktop ? 'items-center justify-center p-6' : 'items-end'].join(' ')}>
          <motion.div
            className="absolute inset-0 bg-espresso/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={[
              'relative flex w-full flex-col overflow-clip bg-milk shadow-[0_-20px_60px_-20px_rgb(28_26_23_/_0.35)] focus:outline-none',
              desktop ? `max-h-[88vh] rounded-[18px] ${wide ? 'max-w-[720px]' : 'max-w-[560px]'}` : 'max-h-[92dvh] rounded-t-[22px]',
            ].join(' ')}
            {...variants}
            transition={{ duration: reduce ? 0 : desktop ? 0.45 : 0.55, ease: EASE }}
            drag={desktop ? false : 'y'}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            {!desktop && (
              <div className="absolute inset-x-0 top-0 z-20 flex h-6 cursor-grab touch-none justify-center pt-2 active:cursor-grabbing" onPointerDown={(e) => drag.start(e)} aria-hidden>
                <span className="h-1 w-10 rounded-full bg-espresso/25 mix-blend-multiply" />
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              {children}
            </div>
            {footer && <div className="border-t border-line bg-milk px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:px-6 md:pb-5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
