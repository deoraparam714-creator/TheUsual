import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Tally } from '@/components/brand/Tally';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col px-4 py-6 md:px-12 md:py-10">
      <Link href="/" aria-label="the usual — home" className="self-start">
        <Logo variant="oneline" decorative className="h-6 w-auto" />
      </Link>
      <div className="my-auto max-w-3xl py-20">
        <Tally count={4} ghost className="w-16" />
        <p className="t-label mt-10 text-grind">404</p>
        <h1 className="t-display mt-4">
          Not on the <span className="accent">menu</span>
          <span className="dot" aria-hidden />
        </h1>
        <p className="t-body-lg mt-6 max-w-[36ch] text-grind">That page doesn’t exist, or it moved. Your usual is still where you left it.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/order" variant="lime" arrow>
            Order my usual
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
