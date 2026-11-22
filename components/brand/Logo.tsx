import { type LogoArt, MARK, ONELINE, STACKED } from './logo-paths';

type Variant = 'stacked' | 'oneline' | 'mark';

const ART: Record<Variant, LogoArt> = { stacked: STACKED, oneline: ONELINE, mark: MARK };

type Props = {
  variant?: Variant;
  className?: string;
  /** One-colour versions (on lime, on kraft): the dot takes the letter colour. */
  mono?: boolean;
  title?: string;
  /** Hide from assistive tech when a visible label is next to it. */
  decorative?: boolean;
};

/**
 * the usual. wordmark, from the official vector artwork in the brand guidelines.
 * Letters use currentColor (espresso or milk). The dot is always lime unless `mono`.
 * Min sizes (p.10): stacked 80px, one line 120px, mark 16px.
 */
export function Logo({ variant = 'stacked', className, mono = false, title = 'the usual.', decorative = false }: Props) {
  const art = ART[variant];
  return (
    <svg
      viewBox={`0 0 ${art.w} ${art.h}`}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { 'aria-hidden': true, focusable: false } : { role: 'img', 'aria-label': title })}
    >
      {art.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <circle cx={art.dot.cx} cy={art.dot.cy} r={art.dot.r} fill={mono ? 'currentColor' : 'var(--color-lime)'} />
    </svg>
  );
}
