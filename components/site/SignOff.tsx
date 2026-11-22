import { Logo } from '@/components/brand/Logo';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from './Section';

/** The sign-off (p.07): end of every post, receipt, bag — and page. One colour on lime. */
export function SignOff({ cta = { href: '/order', label: 'Order my usual' } }: { cta?: { href: string; label: string } }) {
  return (
    <section className="bg-lime py-20 text-espresso md:py-32" aria-labelledby="signoff-title">
      <Container className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
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
          <Reveal delay={200} className="mt-10">
            <ButtonLink href={cta.href} variant="espresso" size="lg" arrow>
              {cta.label}
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal fade delay={300} className="md:col-span-3 md:col-start-10 md:justify-self-end">
          <Logo variant="stacked" mono className="w-[120px] md:w-[150px]" />
        </Reveal>
      </Container>
    </section>
  );
}
