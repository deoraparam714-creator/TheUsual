import { THE_PATH, U_PATH, USUAL_PATH } from './logo-paths';

type Variant = 'stacked' | 'oneline' | 'mark';

const VIEWBOX: Record<Variant, string> = {
  stacked: '778 1568 2539 959',
  oneline: '-844 1816 4161 711',
  mark: '778 1987 708 540',
};

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
 * the usual. wordmark, from vectors traced off the supplied master.
 * Letters use currentColor (espresso or milk). The dot is always lime unless `mono`.
 * Min sizes (p.10): stacked 80px, one line 120px, mark 16px.
 */
export function Logo({ variant = 'stacked', className, mono = false, title = 'the usual.', decorative = false }: Props) {
  const dot = mono ? 'currentColor' : 'var(--color-lime)';
  return (
    <svg
      viewBox={VIEWBOX[variant]}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { 'aria-hidden': true, focusable: false } : { role: 'img', 'aria-label': title })}
    >
      {variant === 'stacked' && (
        <>
          <path d={THE_PATH} />
          <path d={USUAL_PATH} />
          <circle cx="3227" cy="2423" r="90" fill={dot} />
        </>
      )}
      {variant === 'oneline' && (
        <>
          <path transform="matrix(2 0 0 2 -2408 -1319)" d={THE_PATH} />
          <path d={USUAL_PATH} />
          <circle cx="3227" cy="2423" r="90" fill={dot} />
        </>
      )}
      {variant === 'mark' && (
        <>
          <path d={U_PATH} />
          <circle cx="1396" cy="2423" r="90" fill={dot} />
        </>
      )}
    </svg>
  );
}
