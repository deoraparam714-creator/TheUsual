import Image from 'next/image';
import Link from 'next/link';
import { NameSticker } from '@/components/brand/NameSticker';
import { Tally } from '@/components/brand/Tally';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { locationHoursLabel, locations } from '@/lib/site';
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
              <Eyebrow n="04" className="!text-milk/50">
                How it works
              </Eyebrow>
            </Reveal>
            <Lines
              id="ritual-title"
              className="t-display mt-6"
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
            <Tally count={5} draw className="w-16 md:w-40" label="A full tally: four strokes and a lime slash" />
          </div>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] bg-milk/12 md:mt-20 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 120} className="bg-espresso p-5 md:p-10">
              <div className="flex items-center justify-between">
                <span className="t-label text-milk/45">Step {String(i + 1).padStart(2, '0')}</span>
                <Tally count={i === 2 ? 5 : i + 1} className="w-9 text-milk/80" />
              </div>
              <h3 className="t-title mt-6 md:mt-24">
                {s.t}
                <Dot />
              </h3>
              <p className="mt-3 max-w-[30ch] text-milk/65">{s.d}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-8 flex flex-wrap items-center gap-4 md:mt-12">
          <ButtonLink href="/regulars" variant="milk" arrow>
            How the tally works
          </ButtonLink>
          <p className="text-sm text-milk/55">No app to download. No points maths.</p>
        </Reveal>
      </Container>
    </section>
  );
}

export function Places() {
  return (
    <section className="py-20 md:py-36" aria-labelledby="places-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal fade>
              <Eyebrow n="05">Find us</Eyebrow>
            </Reveal>
            <Lines
              id="places-title"
              className="t-display mt-6"
              lines={[
                'Somewhere',
                <>
                  to <span className="accent">land</span>
                  <Dot />
                </>,
              ]}
            />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={150}>
            <p className="t-body-lg text-grind">Between classes, calls and catch-ups. Takeaway from RJ Twin Building today, and a café of our own soon.</p>
          </Reveal>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-20 md:gap-6" aria-label="Locations">
          {locations.map((l, i) => (
            <Reveal as="li" key={l.id} delay={i * 120}>
              <PlaceCard l={l} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function PlaceCard({ l }: { l: (typeof locations)[number] }) {
  const soon = l.status === 'soon';
  const body = (
    <>
      <div className="img-reveal relative aspect-[3/4] overflow-hidden rounded-[18px] bg-toast md:aspect-[4/3]">
        <div className="img-reveal-inner absolute inset-0">
          <Image
            src={l.image}
            alt={l.imageAlt}
            fill
            sizes="(min-width: 768px) 48vw, 50vw"
            className={['object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)]', soon ? 'grayscale-[35%]' : 'group-hover:scale-[1.04]'].join(' ')}
          />
        </div>
        {soon && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-milk px-3 py-1.5 text-xs font-semibold text-espresso">
            <span className="size-1.5 rounded-full bg-grind" aria-hidden />
            Opening soon
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1 md:mt-5 md:flex-row md:items-start md:justify-between md:gap-4">
        <div>
          <p className="t-label text-grind">{l.kind}</p>
          <h3 className="mt-2 font-display text-lg font-extrabold leading-tight tracking-[-0.02em] md:text-[2rem]">{l.name}</h3>
          <p className="mt-1 text-sm text-grind md:mt-2 md:text-[0.9375rem]">{locationHoursLabel(l)}</p>
        </div>
        {!soon && (
          <span className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold md:mt-1">
            Order here <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </span>
        )}
      </div>
    </>
  );
  return soon ? (
    <div>{body}</div>
  ) : (
    <Link href={`/order?location=${l.id}`} className="group block">
      {body}
    </Link>
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
              <p className="t-headline mt-4 max-w-[16ch]">Ghee Roast Roll + cold coffee, every weekday at 1.</p>
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
