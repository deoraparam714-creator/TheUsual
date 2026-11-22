import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from './Section';

/** The sign-off (p.07): end of every post, receipt, bag — and page. */
export function SignOff({ cta = { href: '/order', label: 'Order my usual' } }: { cta?: { href: string; label: string } }) {
  return (
    <section className="bg-lime py-16 text-espresso md:py-28" aria-labelledby="signoff-title">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Lines
          id="signoff-title"
          as="h2"
          className="t-display"
          lines={[
            'Same time',
            <span key="t" className="accent">
              tomorrow?
            </span>,
          ]}
        />
        <Reveal delay={200} className="shrink-0 md:pb-3">
          <ButtonLink href={cta.href} variant="espresso" size="lg" arrow>
            {cta.label}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
