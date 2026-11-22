type Props = {
  name?: string;
  className?: string;
  /** Font sizes scale with the sticker's width via container query units. */
  placeholder?: string;
};

/**
 * The name line (p.15): "the usual for ____", filled in by hand.
 * Lime 40 mm round label, 1-colour espresso.
 */
export function NameSticker({ name, className, placeholder = '' }: Props) {
  const shown = name?.trim() || placeholder;
  const len = shown.length;
  // Long names shrink so they stay on the line.
  const nameSize = len > 12 ? 12 : len > 8 ? 15 : 19;
  return (
    <div
      className={['relative grid aspect-square place-items-center rounded-full bg-lime text-espresso [container-type:inline-size]', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={shown ? `the usual for ${shown}` : 'the usual for — name sticker'}
    >
      <div className="flex w-[66%] flex-col items-center">
        <span className="font-sans text-[9cqw] font-semibold leading-none tracking-[-0.01em]">the usual for</span>
        <span
          className="hand mt-[5cqw] block w-full truncate border-b-[0.9cqw] border-espresso pb-[1.5cqw] text-center leading-[1.1]"
          style={{ fontSize: `${nameSize}cqw`, minHeight: '1.2em' }}
        >
          {shown || ' '}
        </span>
      </div>
    </div>
  );
}
