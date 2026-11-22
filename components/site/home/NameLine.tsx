'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useState } from 'react';
import { Cup } from '@/components/brand/Cup';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { useHydrated } from '@/hooks/useHydrated';
import { useProfile } from '@/store/profile';
import { Container, Dot, Eyebrow } from '../Section';

const NAMES = ['Riya', 'Kabir', 'Arjun', 'Meera', 'Zoya', 'Dev', 'Ananya'];

export function NameLine() {
  const hydrated = useHydrated();
  const storedName = useProfile((s) => s.name);
  const setName = useProfile((s) => s.setName);
  const [typed, setTyped] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const inputId = useId();

  const value = typed ?? (hydrated ? storedName : '');
  const shown = value.trim() || NAMES[i];

  useEffect(() => {
    if (value.trim() || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % NAMES.length), 2200);
    return () => clearInterval(t);
  }, [value, reduce]);

  return (
    <section className="relative overflow-hidden bg-toast py-20 md:py-36" aria-labelledby="nameline-title">
      <Container className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <Reveal fade>
            <Eyebrow n="03" className="!text-espresso/60">
              The name line
            </Eyebrow>
          </Reveal>
          <Lines
            id="nameline-title"
            className="t-display mt-6"
            lines={[
              'No name,',
              <>
                no <span className="accent">cup</span>
                <Dot />
              </>,
            ]}
          />
          <Reveal delay={150}>
            <p className="t-body-lg mt-8 max-w-[38ch] text-espresso/75">
              Every cup, wrap and bowl gets a name, written by hand. People photograph their name, not our logo. That’s the idea.
            </p>
          </Reveal>
          <Reveal delay={250} className="mt-10 max-w-sm">
            <label htmlFor={inputId} className="t-label text-espresso/60">
              Try yours
            </label>
            <div className="mt-3 flex items-center gap-3 border-b border-espresso pb-2">
              <input
                id={inputId}
                value={value}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\p{L}\p{M} .'-]/gu, '').slice(0, 14);
                  setTyped(v);
                  setName(v.trim());
                }}
                placeholder="Your name"
                autoComplete="given-name"
                className="hand w-full bg-transparent text-4xl leading-tight placeholder:text-espresso/30 focus:outline-none"
              />
              {value && (
                <button type="button" onClick={() => (setTyped(''), setName(''))} className="t-label shrink-0 py-2 text-espresso/60 hover:text-espresso">
                  Clear
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-espresso/60">We’ll have it ready at checkout.</p>
          </Reveal>
        </div>

        <div className="relative flex justify-center md:col-span-5 md:col-start-8">
          <div className="relative w-[64vw] max-w-[340px] md:w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={shown}
                initial={reduce ? false : { opacity: 0, y: 14, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                exit={reduce ? undefined : { opacity: 0, y: -10, rotate: -5 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Cup name={shown} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
      <p className="sr-only" aria-live="polite">
        {value.trim() ? `The sticker now reads: the usual for ${value.trim()}` : ''}
      </p>
    </section>
  );
}
