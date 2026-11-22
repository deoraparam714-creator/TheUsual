import Image from 'next/image';
import Link from 'next/link';
import { NameSticker } from '@/components/brand/NameSticker';
import { Tally } from '@/components/brand/Tally';
import { Lines } from '@/components/motion/Lines';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { formatHours, locations } from '@/lib/site';
import { Container, Dot, Eyebrow } from '../Section';

const STEPS = [
  { t: 'Pick it once', d: 'Order ahead and save it as your usual. Next time it’s one tap.' },
  { t: 'Pick it up', d: 'Ready in about six minutes, with your name on the cup.' },
  { t: 'Tally up', d: 'Four strokes and a slash: five visits, one regular. The next one’s on us.' },
];

export function Ritual() {
  return (
    <section className="on-dark relative overflow-hidden bg-espresso py-24 text-milk md:py-40" aria-labelledby="ritual-title">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal fade>
              <Eyebrow n="05" className="!text-milk/50">
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
            <Tally count={5} draw className="w-28 md:w-40" label="A full tally: four strokes and a lime slash" />
          </div>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] bg-milk/12 md:mt-24 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 120} className="bg-espresso p-7 md:p-10">
              <div className="flex items-center justify-between">
                <span className="t-label text-milk/45">Step {String(i + 1).padStart(2, '0')}</span>
                <Tally count={i === 2 ? 5 : i + 1} className="w-9 text-milk/80" />
              </div>
              <h3 className="t-title mt-14 md:mt-24">
                {s.t}
                <Dot />
              </h3>
              <p className="mt-3 max-w-[30ch] text-milk/65">{s.d}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-wrap items-center gap-4">
          <ButtonLink href="/regulars" variant="milk" arrow>
            How the tally works
          </ButtonLink>
          <p className="text-sm text-milk/55">No app to download. No points maths.</p>
        </Reveal>
      </Container>
    </section>
  );
}

function Photo({ src, alt, caption, className, aspect, sizes, position }: { src: string; alt: string; caption: string; className?: string; aspect: string; sizes: string; position?: string }) {
  return (
    <figure className={className}>
      <div className={`img-reveal relative overflow-hidden rounded-[18px] bg-toast ${aspect}`}>
        <div className="img-reveal-inner absolute inset-0">
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={position ? { objectPosition: position } : undefined} />
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-grind">{caption}</figcaption>
    </figure>
  );
}

export function Gallery() {
  return (
    <section className="py-24 md:py-40" aria-label="A day at the usual">
      <Container>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
          <Photo className="md:col-span-8" aspect="aspect-[16/10]" src="/images/table-spread.jpg" alt="A hot cup for Riya, an iced latte, a roll and a bowl on a timber table in morning light" caption="The table. Flat white, bowl, roll, morning light." sizes="(min-width: 768px) 64vw, 100vw" />
          <Photo className="md:col-span-4 md:mt-32" aspect="aspect-square" src="/images/hot-chocolate.jpg" alt="A steaming hot chocolate with a ‘the usual for Kabir’ sticker" caption="Kabir’s usual. Every weekday, 4 pm." sizes="(min-width: 768px) 32vw, 100vw" />
          <Photo className="md:col-span-4" aspect="aspect-[4/5]" src="/images/bag-and-cup.jpg" alt="Espresso paper bag printed ‘Same time tomorrow?’ beside a the usual cup" caption="The bag. It asks the question for us." sizes="(min-width: 768px) 32vw, 100vw" />
          <Photo className="md:col-span-8 md:-mt-24 md:self-end" aspect="aspect-[16/9]" src="/images/flat-lay.jpg" alt="Flat lay of the usual cups, wrap, bowl, bags, loyalty cards, name stickers and cap" caption="Everything gets a name. Most things get a tally." sizes="(min-width: 768px) 64vw, 100vw" />
        </div>
      </Container>
    </section>
  );
}

export function Places() {
  return (
    <section className="border-t border-line py-24 md:py-40" aria-labelledby="places-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal fade>
              <Eyebrow n="06">Find us</Eyebrow>
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
            <p className="t-body-lg text-grind">Between classes, calls and catch-ups. A cart, a café and a kiosk, all making it the same way.</p>
          </Reveal>
        </div>
        <ul className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-6">
          {locations.map((l, i) => (
            <Reveal as="li" key={l.id} delay={i * 120}>
              <Link href={`/order?location=${l.id}`} className="group block">
                <div className="img-reveal relative aspect-[3/4] overflow-hidden rounded-[18px] bg-toast">
                  <div className="img-reveal-inner absolute inset-0">
                    <Image src={l.image} alt={l.imageAlt} fill sizes="(min-width: 768px) 32vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="t-label text-grind">{l.kind}</p>
                    <h3 className="t-title mt-2">{l.name}</h3>
                    <p className="mt-2 text-[0.9375rem] text-grind">{formatHours(l.hours)}</p>
                  </div>
                  <span className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-semibold">
                    Order here <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
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

export function Merch() {
  return (
    <section className="bg-canvas py-24 md:py-40" aria-labelledby="merch-title">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal fade>
              <Eyebrow n="07" className="!text-espresso/60">
                Merch
              </Eyebrow>
            </Reveal>
            <Lines
              id="merch-title"
              className="t-display mt-6"
              lines={[
                'You can’t',
                <>
                  buy this <span className="accent">tote</span>
                  <Dot />
                </>,
              ]}
            />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={150}>
            <p className="t-body-lg text-espresso/75">It comes free with your first full tally card. Never sold. Scarcity makes it a badge.</p>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-12">
          <Photo className="md:col-span-6" aspect="aspect-[4/5]" src="/images/tote.jpg" alt="A natural canvas the usual tote hanging on a wooden peg" caption="The tote. Earned, not bought." sizes="(min-width: 768px) 48vw, 100vw" />
          <div className="grid gap-x-6 gap-y-10 md:col-span-6 md:mt-40">
            <Photo aspect="aspect-square" src="/images/cap-and-mug.jpg" alt="A cream cap with the u. mark beside a the usual mug with latte art" caption="The cap and the mug. For the counter crew, and later, for you." sizes="(min-width: 768px) 48vw, 100vw" />
            <Photo aspect="aspect-[4/5]" src="/images/tee.jpg" alt="A cream tee with a small the usual logo on the chest" caption="The tee. Small logo, big regular." sizes="(min-width: 768px) 48vw, 100vw" position="50% 35%" />
          </div>
        </div>
      </Container>
    </section>
  );
}
