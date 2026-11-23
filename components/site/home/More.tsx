import Link from 'next/link';
import { NameSticker } from '@/components/brand/NameSticker';
import { Tally } from '@/components/brand/Tally';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { OpenStatus } from '@/components/site/OpenStatus';
import { locationHoursLabel, openLocations } from '@/lib/site';
import { Container, Dot, Eyebrow } from '../Section';

const STEPS = [
  { t: 'Pick it once', d: 'Order ahead and save it as your usual. Next time it’s one tap.' },
  { t: 'Pick it up', d: 'Ready in about six minutes, with your name on the cup.' },
  { t: 'Tally up', d: 'Four strokes and a slash: five visits, one regular. The next one’s on us.' },
];

export function Ritual() {
  return (
    <section className="on-dark relative overflow-hidden bg-espresso py-20 text-milk md:py-36" aria-labelledby="ritual-title">
      <Container>
        <div className="grid grid-cols-[1fr_auto] items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <Reveal fade>
              <Eyebrow className="!text-milk/50">
                How it works
              </Eyebrow>
            </Reveal>
            <Lines
              id="ritual-title"
              className="t-headline mt-5"
              lines={[
                'Your usual,',
                <>
                  <span className="accent">counted</span>
                  <Dot />
                </>,
              ]}
            />
          </div>
          <div className="text-milk md:col-span-3 md:col-start-10">
            <Tally count={5} draw className="w-14 md:w-32" label="A full tally: four strokes and a lime slash" />
          </div>
        </div>

        <ol className="mt-10 grid grid-cols-1 border-t border-milk/12 md:mt-20 md:grid-cols-3 md:gap-px md:overflow-hidden md:rounded-[18px] md:border-0 md:bg-milk/12">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 120} className="border-b border-milk/12 py-7 md:border-0 md:bg-espresso md:p-10">
              <div className="flex items-center justify-between">
                <span className="t-label text-milk/45">Step {String(i + 1).padStart(2, '0')}</span>
                <Tally count={i === 2 ? 5 : i + 1} className="w-9 text-milk/80" />
              </div>
              <h3 className="t-title mt-4 md:mt-24">
                {s.t}
                <Dot />
              </h3>
              <p className="mt-2 max-w-[34ch] text-milk/65">{s.d}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4 md:mt-12">
          <ButtonLink href="/regulars" variant="milk" arrow>
            How the tally works
          </ButtonLink>
          <p className="text-sm text-milk/55">No app to download. No points maths.</p>
        </Reveal>
      </Container>
    </section>
  );
}

/** Text-only: where and how to get your usual. */
export function FindUs() {
  const ways = openLocations;
  return (
    <section id="find-us" className="py-20 md:py-32" aria-labelledby="find-title">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal variant="fade">
              <Eyebrow>Find us</Eyebrow>
            </Reveal>
            <Lines
              id="find-title"
              className="t-headline mt-5"
              lines={[
                'Find us',
                <>
                  at <span className="accent">Mesa</span>
                  <Dot />
                </>,
              ]}
            />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={150}>
            <p className="t-body-lg text-grind">Two ways to get your usual. Walk up to the counter, or order ahead and it’s ready when you are.</p>
          </Reveal>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          {ways.map((l, i) => (
            <Reveal as="li" key={l.id} variant={i % 2 ? 'right' : 'left'} delay={i * 120}>
              <Link href={`/order?location=${l.id}`} className="group flex h-full flex-col rounded-[22px] bg-foam p-6 transition-colors duration-500 hover:bg-toast md:p-10">
                <h3 className="t-title max-w-[16ch]">
                  {l.kind === 'Takeaway' ? `Takeaway from ${l.name}` : `Pre-order at ${l.name}`}
                  <Dot />
                </h3>
                <p className="mt-3 max-w-[38ch] text-grind">{l.how}</p>
                <OpenStatus locationId={l.id} className="mb-6 mt-3 text-xs text-grind md:mb-10" />
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4 text-sm">
                  <span className="text-grind">{locationHoursLabel(l)}</span>
                  <span className="inline-flex min-h-11 items-center gap-1 font-semibold">
                    {l.preorderOnly ? 'Pre-order' : 'Order ahead'} <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal variant="fade" className="mt-6">
          <p className="text-sm text-grind">A café of our own is opening soon. Regulars hear first.</p>
        </Reveal>
      </Container>
    </section>
  );
}

export function UsualOfTheWeek() {
  return (
    <section className="pb-24 md:pb-40" aria-labelledby="uotw-title">
      <Container>
        <Reveal>
          <article className="on-dark relative grid grid-cols-1 overflow-hidden rounded-[18px] bg-espresso text-milk md:grid-cols-12">
            <div className="p-7 md:col-span-7 md:p-14">
              <p className="t-label text-lime" id="uotw-title">
                Usual of the week
              </p>
              <p className="hand mt-10 text-5xl md:text-6xl">Riya, 22</p>
              <p className="t-title mt-4 max-w-[18ch]">Ghee Roast Roll + cold coffee, every weekday at 1.</p>
              <div className="mt-12 flex items-end justify-between gap-6">
                <Tally count={5} draw className="w-16 text-milk md:w-20" label="Tally full" />
                <p className="max-w-[24ch] text-right text-sm text-milk/55">A real regular and their order, every week. Could be you.</p>
              </div>
            </div>
            <div className="relative grid min-h-72 place-items-center bg-[#26231f] p-10 md:col-span-5">
              <NameSticker name="Riya" className="w-52 -rotate-6 md:w-64" />
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
