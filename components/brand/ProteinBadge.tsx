/**
 * The protein sticker: a lime round label (stickers are a lime moment, p.11) with the
 * claim running around the edge. Spins slowly; still for reduced-motion users.
 */
export function ProteinBadge({ className }: { className?: string }) {
  return (
    <div className={['relative grid aspect-square place-items-center overflow-hidden rounded-full bg-lime text-espresso shadow-[0_18px_40px_-18px_rgb(28_26_23_/_0.55)]', className].filter(Boolean).join(' ')} role="img" aria-label="35g+ protein in every roll">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="badge-ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text fill="currentColor" style={{ font: '700 15px var(--font-inter), sans-serif' }}>
          <textPath href="#badge-ring" textLength="470" lengthAdjust="spacing">IN EVERY ROLL · 100% VEGETARIAN ·</textPath>
        </text>
      </svg>
      <div className="relative text-center leading-none">
        <span className="block font-display text-[2.4em] font-extrabold tracking-[-0.04em]">35g+</span>
        <span className="mt-[0.15em] block text-[0.62em] font-semibold uppercase tracking-[0.14em]">protein</span>
      </div>
    </div>
  );
}
